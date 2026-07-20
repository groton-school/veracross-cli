import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  roles?: number[];
  dryRun?: boolean;
};

export const name = 'swapEmails';

const scope = [
  'person_accounts:list',
  'contact_info:read',
  'contact_info:update'
];

const PAGE_SIZE = 100;
const config: Configuration = {
  roles: [7], // Future Student,
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
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ],
    numList: {
      role: {
        description: `The role ID for the security roles of the users to be affected ${Colors.url('https://axiom.veracross.com/#/results/74')}`,
        default: config.roles
      }
    },
    flag: {
      dryRun: {
        description: 'Run a dry-run of the script without making changes',
        default: config.dryRun
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  const { role: roles, ...rest } = values;
  configure({ roles, ...rest });
  Veracross.configure({
    reason: 'vc persons swapEmail',
    credentials: {
      scope
    }
  });
}

export async function run() {
  for (const role of config.roles || []) {
    let page = 1;
    let done = false;
    do {
      const {
        data: { data = [] } = {},
        error,
        response
      } = await Veracross.Data().GET('/person_accounts', {
        params: {
          query: { role },
          header: { 'X-Page-Number': page, 'X-Page-Size': PAGE_SIZE }
        }
      });
      for (const person of data) {
        const spinner = ora(person.username).start();
        const { data: { data: contact_info } = {} } =
          await Veracross.Data().GET('/contact_info/{id}', {
            params: {
              path: { id: person.person_id }
            }
          });
        if (contact_info?.email_1 && contact_info?.email_2) {
          if (config.dryRun) {
            if (contact_info.email_1 && contact_info.email_2) {
              spinner.info(
                `${person.username} will swap ${contact_info.email_1} and ${contact_info.email_2}`
              );
            } else {
              spinner.warn(
                `${person.username} is missing ${
                  contact_info.email_1
                    ? 'email_2'
                    : contact_info.email_2
                      ? 'email_1'
                      : 'email_1 and email_2'
                }`
              );
            }
          } else {
            const { error } = await Veracross.Data().PATCH(
              '/contact_info/{id}',
              {
                params: {
                  path: { id: person.person_id }
                },
                body: {
                  data: {
                    email_1: contact_info.email_2,
                    email_2: contact_info.email_1
                  }
                }
              }
            );
            if (error) {
              spinner.fail(
                `Error swapping emails for ${person.username}:\n${Log.syntaxColor(error)}`
              );
            } else {
              spinner.succeed(
                `${Colors.value(contact_info.name)} swapped (${Colors.varName('email_1')}:${Colors.url(contact_info.email_2)}; ${Colors.varName('email_2')}:${Colors.url(contact_info.email_1)})`
              );
            }
          }
        } else {
          spinner.warn(
            `${person.username} is missing ${
              contact_info?.email_1
                ? 'email_2'
                : contact_info?.email_2
                  ? 'email_1'
                  : 'email_1 and email_2'
            })
              .join(' and ')}`
          );
        }
      }
      done = data.length < PAGE_SIZE;
    } while (!done);
  }
}
