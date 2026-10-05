import fs from 'node:fs';
import path from 'node:path';
import {
  DateTimeString,
  PathString,
  URLString
} from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import ora from 'ora';
import puppeteer from 'puppeteer';

import '@qui-cli/env';

import { Positionals } from '@qui-cli/core';
import { parse, stringify } from 'csv/sync';
import { CSV } from '../../../lib/index.js';

type ClassRedirect = {
  internal_class_id: number;
  page?: string;
  url: URLString;
};

type ClassResult = ClassRedirect & {
  created: DateTimeString;
};

export type Configuration = Plugin.Configuration & {
  pathToCsv?: PathString;
  school_route?: string;
  username?: string;
  password?: string;
} & Partial<ClassRedirect>;

Positionals.require({
  pathToCsv: {
    description: 'Path to a CSV file of redirect information'
  }
});
Positionals.allowOnlyNamedArgs();
Positionals.requireAtLeast(0);

const DEFAULT_PAGE_NAME = 'Redirect';

const config: Configuration = {
  page: DEFAULT_PAGE_NAME
};

export function configure(proposal: Configuration = {}) {
  for (const key in proposal) {
    if (proposal[key] !== undefined) {
      config[key] = proposal[key];
    }
  }
}

export function options() {
  return {
    man: [{ level: 1, text: 'LMS Redirect Options' }],
    opt: {
      schoolRoute: {
        description: `Veracross school route short code`,
        hint: Colors.quotedValue(`"schoolname"`),
        default: config.school_route
      },
      username: {
        description: 'Veracross user name',
        env: 'VERACROSS_USER',
        default: config.username
      },
      password: {
        description: 'Microsoft Entra ID password',
        env: 'ENTRA_PASSWORD',
        default: config.password
      },
      url: {
        description: `URL to redirect to`,
        hint: Colors.quotedValue(`"https://example.com"`),
        default: config.url
      },
      page: {
        description: `Page name for redirect`,
        default: config.page
      }
    },
    num: {
      internalClassId: {
        description: `Veracross internal class ID to set redirect on`,
        default: config.internal_class_id
      }
    }
  };
}

export function init({
  values: {
    internalClassId: internal_class_id,
    schoolRoute: school_route,
    ...rest
  }
}: Plugin.ExpectedArguments<typeof options>) {
  const pathToCsv = Positionals.get('pathToCsv');
  configure({ pathToCsv, school_route, internal_class_id, ...rest });
}

export async function run() {
  const { school_route, internal_class_id, url, page } = config;
  if (!school_route) {
    Log.fatal(`${Colors.optionArg('schoolRoute')} must be defined`);
    process.exit(1);
  }

  const data: ClassRedirect[] =
    internal_class_id && url ? [{ internal_class_id, page, url }] : [];
  let outputPath: string | undefined = undefined;
  const result: ClassResult[] = [];

  if (config.pathToCsv) {
    const filePath = path.resolve(process.cwd(), config.pathToCsv);
    outputPath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, path.extname(filePath))}.result.csv`
    );
    const csv = await parse<ClassRedirect>(fs.readFileSync(filePath, 'utf8'), {
      columns: true,
      cast: CSV.cast({ internal_class_id: 'int' })
    });
    data.push(...csv);
  }

  const spinner = ora('Awaiting authentication ').start();

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1000, height: 800 }
  });
  const [tab] = await browser.pages();

  try {
    await tab.goto(`https://portals.veracross.com/${school_route}`);
    if (config.username) {
      spinner.text = 'Entering username';
      await tab.locator('#username').fill(config.username);
      await tab.locator('input[type="submit"]').click();
    }

    if (config.password) {
      spinner.text = 'Entering password';
      await tab.locator('input[name="passwd"]').fill(config.password);
      await tab.locator('input[type="submit"]').click();
      const instructions = await (
        await tab.waitForSelector('#idDiv_SAOTCAS_Description')
      )?.evaluate((el) => el.textContent);
      const code = await (
        await tab.waitForSelector('#idRichContext_DisplaySign')
      )?.evaluate((el) => el.textContent);

      spinner.text =
        instructions && code
          ? instructions.replace('the number', Colors.value(code))
          : 'Waiting for MFA';
    }

    spinner.text = 'Waiting for portal authentication';
    await tab.locator('.vx-system-nav').wait();
    spinner.succeed('Authenticated');

    for (const { internal_class_id, page = DEFAULT_PAGE_NAME, url } of data) {
      spinner.start(`Creating ${Colors.value(page)} redirect page`);
      const websiteAdminUrl = `https://portals-embed.veracross.com/${school_route}/course/${internal_class_id}/website-admin/pages`;
      await tab.goto(websiteAdminUrl);

      await tab.locator('#add-item').click();
      await tab.locator('.modal-content input[type="text"]').fill(page);
      await tab.locator('.modal-content a.button.add.publish').click();

      spinner.text = 'Adding embed code';
      const composer = await tab.waitForFrame(async (frame) => {
        const frameElement = await frame.frameElement();
        if (!frameElement) {
          return false;
        }
        const id = await frameElement.evaluate((el) => el.getAttribute('id'));
        return id === 'composer-frame';
      });
      if (!composer) {
        throw new Error();
      }
      await composer.locator('.add-button[data-type="embed-code"]').click();
      const embed = await composer.waitForSelector(
        '.preview .section:has(.embed) .section-button.edit'
      );
      if (!embed) {
        throw new Error('Embed code button not found');
      }
      await embed.evaluate((el) => el.click());

      await composer
        .locator('.sidebar .editor-field textarea.embed-control')
        .fill(
          `<iframe width="100%" height="300" scrolling="no" frameborder="no" src="${url}"></iframe>`
        );
      await composer.waitForSelector('.last-saved:has(.fa.fa-pencil', {
        hidden: true
      });

      spinner.text = `Publishing ${Colors.value(page)} page`;
      await composer.locator('.publish.action-button.add').click();
      await tab.locator('.modal-content .button.add.publish').click();
      await tab.waitForNavigation();

      spinner.text = `Making ${Colors.value(page)} page the class home page`;
      await tab.waitForSelector('.pages .page.published');
      const published = (await tab.$$('.pages .page.published')).find((pub) =>
        pub.evaluate(
          (el, ...[page]) => el.querySelector('.title').innerText === page,
          page
        )
      );
      if (!published) {
        throw new Error(`Published ${Colors.value(page)} page not found`);
      }
      const options = await published.$('.button.options');
      if (!options) {
        throw new Error('Options button not found');
      }
      await options.click();
      await published.waitForSelector('.button:has(.fa.fa-star)');
      await tab
        .locator('.pages .page.published .button:has(.fa.fa-star)')
        .click();

      spinner.text = 'Saving changes';
      const done = await published.waitForSelector(
        '.homepage-indicator:has(.fa.fa-star)'
      );
      if (!done) {
        throw new Error('Homepage status not verified');
      }

      spinner.text = 'Saving result';
      result.push({
        internal_class_id,
        page,
        url,
        created: new Date().toISOString()
      });
      if (outputPath) {
        fs.writeFileSync(outputPath, stringify(result, { header: true }));
      }
      spinner.succeed(`${Colors.value(page)} page redirected`);
    }
    await tab.close();
  } catch (error) {
    spinner.fail();
    Log.error(Colors.error((error as Error).message));
  } finally {
    await browser.close();
  }

  if (outputPath) {
    Log.info(`Creation timestamps written to ${Colors.path(outputPath)}`);
  }
}
