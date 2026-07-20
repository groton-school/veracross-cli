import { PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { parse } from 'csv/sync';
import ora from 'ora';
import fs from 'node:fs';
import path from 'node:path';

export type Configuration = Plugin.Configuration & {
  pathToCsv?: PathString;
  dryRun?: boolean;
};

type ContactInfo = { person_id: number; email_1?: string; email_2?: string };

Positionals.require({
  pathToCsv: {
    description: `Path to CSV file containing at least the column ${Colors.varName('person_id')}. If the columns ${Colors.varName('email_1')} and/or ${Colors.varName('email_2')} are present they will be used as the new values for those fields.`
  }
});
Positionals.allowOnlyNamedArgs();

export const name = 'swapEmails';

const scope = ['contact_info:read', 'contact_info:update'];

const config: Configuration = {
  dryRun: false
};

export function configure(proposal: Configuration = {}) {
  for (const key in proposal) {
    if (proposal[key] !== undefined) {
      config[key] = proposal[key];
    }
  }
}

export function options(): Plugin.Options {
  return {
    man: [
      { level: 1, text: 'Swap Emails Options' },
      {
        text:
          `Swap ${Colors.varName('email_1')} and ${Colors.varName('email_2')} ` +
          `fields on user contact info, or replace them entirely with values ` +
          `provided from the CSV file provided. If the CSV file contains ` +
          `either email column, the existing data inthe database for that ` +
          `column will be overwritten (and the other column will onl be ` +
          `updated if that column is provided in the CSV file)`
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ],
    flag: {
      dryRun: {
        description: 'Run a dry-run of the script without making changes',
        default: config.dryRun
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  configure({ pathToCsv: Positionals.get('pathToCsv'), ...values });
  Veracross.configure({
    reason: 'vc people swapEmail',
    credentials: {
      scope
    }
  });
}

export async function run() {
  if (!config.pathToCsv) {
    Log.error(`${Colors.positionalArg('pathToCsv')} must be defined`);
    process.exit(1);
  }
  const data = parse<ContactInfo>(
    fs.readFileSync(path.resolve(process.cwd(), config.pathToCsv), 'utf8'),
    { columns: true }
  );

  for (const row of data) {
    const spinner = ora(`Person ID ${row.person_id}`).start();
    const { data: { data: contact_info } = {}, error } =
      await Veracross.Data().GET('/contact_info/{id}', {
        params: { path: { id: row.person_id } }
      });
    if (error) {
      spinner.fail(
        `${spinner.text}: ${Colors.error(`Error ${error.error_id}: ${error.error}`)}`
      );
      continue;
    }
    if (contact_info) {
      spinner.text = contact_info?.name;
      let email_1: string | undefined = undefined;
      let email_2: string | undefined = undefined;
      if (row.email_1) {
        email_1 = row.email_1;
      }
      if (row.email_2) {
        email_2 = row.email_2;
      }
      if (!email_1 && !email_2) {
        email_1 = contact_info.email_2;
        email_2 = contact_info.email_1;
      }
      if (!config.dryRun) {
        const { error } = await Veracross.Data().PATCH('/contact_info/{id}', {
          params: {
            path: { id: row.person_id }
          },
          body: {
            data: {
              email_1: email_1 || contact_info.email_1,
              email_2: email_2 || contact_info.email_2
            }
          }
        });
        if (error) {
          spinner.fail(
            `${spinner.text}: ${Colors.error(`Error ${error.error_id}: ${error.error}`)}`
          );
          continue;
        }
        spinner.succeed(
          `${spinner.text}: ${Colors.varName(
            'email_1'
          )} = ${email_1 || contact_info.email_1}, ${Colors.varName(
            'email_2'
          )} = ${email_2 || contact_info.email_2}`
        );
      } else {
        spinner.info(
          `${spinner.text}: ${Colors.varName(
            'email_1'
          )} = ${email_1 || contact_info.email_1}, ${Colors.varName(
            'email_2'
          )} = ${email_2 || contact_info.email_2} [${Colors.value('Dry run')}]`
        );
      }
    } else {
      spinner.warn(`No contact info record found for ${spinner.text}`);
      continue;
    }
  }
}
