import { URLString } from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import ora from 'ora';
import puppeteer from 'puppeteer';

import '@qui-cli/env';

export type Configuration = Plugin.Configuration & {
  schoolRoute?: string;
  username?: string;
  password?: string;
  internalClassId?: number;
  page?: string;
  url?: URLString;
};

const config: Configuration = {
  page: 'Redirect'
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
        default: config.schoolRoute
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
        default: config.internalClassId
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  configure(values);
}

export async function run() {
  const { schoolRoute, internalClassId, url, page } = config;
  if (!schoolRoute) {
    Log.fatal(`${Colors.optionArg('schoolRoute')} must be defined`);
    process.exit(1);
  }
  if (!internalClassId) {
    Log.fatal(`${Colors.optionArg('internalClassid')} must be defined`);
    process.exit(2);
  }
  if (!url) {
    Log.fatal(`${Colors.optionArg('url')} must be defined`);
    process.exit(3);
  }
  if (!page) {
    Log.fatal(`${Colors.optionArg('page')} must be defined`);
    process.exit(4);
  }

  const spinner = ora('Awaiting interactive login').start();

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1000, height: 800 }
  });
  const [tab] = await browser.pages();

  try {
    const websiteAdminUrl = `https://portals-embed.veracross.com/${config.schoolRoute}/course/${config.internalClassId}/website-admin/pages`;
    await tab.goto(websiteAdminUrl);

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

    await tab.locator('#add-item').wait();
    spinner.succeed('Authenticated');

    spinner.start(`Creating ${Colors.value(page)} redirect page`);
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
    await tab.waitForNavigation();

    spinner.text = `Publishing ${Colors.value(page)} page`;
    await tab.goto(websiteAdminUrl);
    const draftsHandle = await tab.waitForSelector('.pages .page.draft');
    if (!draftsHandle) {
      throw new Error('Drafts not found');
    }
    const draft = (await tab.$$('.page.draft')).find((draft) =>
      draft.evaluate(
        (el, ...[page]) => el.querySelector('.title').innerText === page,
        page
      )
    );
    if (!draft) {
      throw new Error(`Draft ${Colors.value(page)} page not found`);
    }
    const publish = await draft.$('.date .button');
    if (!publish) {
      throw new Error('Publish button not found');
    }
    await publish.click();
    await tab.locator('.modal-content .button.add.publish').click();

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
    await tab.close();
    spinner.succeed(`${Colors.value(page)} page redirected`);
  } catch (error) {
    spinner.fail();
    Log.error(Colors.error((error as Error).message));
  } finally {
    await browser.close();
  }
}
