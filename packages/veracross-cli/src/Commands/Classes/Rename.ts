import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  needle?: string;
  regex?: RegExp;
  replace?: string;
  schoolYear?: number;
  dryRun?: boolean;
};

const scope = ['academics.classes:list', 'academics.classes:update'];
const PAGE_SIZE = 100;

const config: Configuration = {
  schoolYear:
    new Date().getMonth() >= 6
      ? new Date().getFullYear()
      : new Date().getFullYear() - 1,
  type: 'academics'
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
      { level: 1, text: 'Class Enrollment Update' },
      {
        text: `Rename classes`
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ],
    num: {
      schoolYear: {
        description: `The ${Colors.varName('school_year')} value from which to create the "haystack" of courses to rename`,
        default: config.schoolYear
      }
    },
    opt: {
      needle: {
        description: `Plain text value to search for and replace with ${Colors.optionArg('--replace')}. Takes precedence over ${Colors.optionArg('--regex')} if both are present.`,
        default: config.needle
      },
      regex: {
        description: `Regular expression to match and replace with ${Colors.optionArg('--replace')}.`,
        hint: Colors.quotedValue(`"/^.*(foo)\\$/i"`),
        default: config.regex
          ? `/${config.regex.source}/${config.regex.flags || ''}`
          : undefined
      },
      replace: {
        description: `A plain text value to replace ${Colors.optionArg('--needle')}} with, if defined. If ${Colors.optionArg('--regex')} is defined, this may include match groups as well`,
        hint: ['bar', '$2 baz $1']
          .map((v) => Colors.quotedValue(`"${v}"`))
          .join('|'),
        default: config.replace
      }
    },
    flag: {
      dryRun: {
        description: `Make a dry run with the provided configuration, effecting no changes in Veracross`,
        default: config.dryRun
      }
    }
  };
}

export function init({
  values: { regex: regexString, ...rest }
}: Plugin.ExpectedArguments<typeof options>) {
  const [, source, flags] =
    (regexString as string | undefined)?.match(/^\/(.*)\/([a-z]*)/) || [];
  const regex = source ? new RegExp(source, flags) : undefined;
  configure({ regex, ...rest });
  Veracross.configure({
    reason: 'vc classes rename',
    credentials: { scope }
  });
  Log.debug(config);
}

export async function run() {
  if (!config.schoolYear) {
    throw new Error(`${Colors.optionArg('--schoolYear')} must be defined`);
  }
  if (!config.needle && !config.regex) {
    throw new Error(
      `Either ${Colors.optionArg('--needle')} or ${Colors.optionArg('--regex')} must be defined`
    );
  }
  if (!config.replace) {
    throw new Error(`${Colors.optionArg('--replace')} must be defined`);
  }
  const classes: Veracross.DataAPI.operations['list_academics_classes']['responses']['200']['content']['application/json']['data'] =
    [];
  let page = 1;
  let done: boolean;
  do {
    const { data: { data } = {}, error } = await Veracross.Data().GET(
      '/academics/classes',
      {
        params: {
          query: { school_year: config.schoolYear },
          header: { 'X-Page-Size': PAGE_SIZE, 'X-Page-Number': page }
        }
      }
    );
    if (error) {
      throw new Error('Error loading classes', { cause: error });
    }
    if (data) {
      classes.push(...data);
    } else {
      throw new Error('No data received');
    }
    done = data?.length < PAGE_SIZE;
    page++;
    Log.debug({ page, length: data.length, done });
  } while (!done);
  for (const c of classes) {
    const spinner = ora(Colors.value(c.description)).start();
    const description = c.description.replace(
      // @ts-expect-error 2769 already tested that at least one is defined above
      config.needle || config.regex,
      config.replace
    );
    if (description !== c.description) {
      if (!config.dryRun) {
        const { error } = await Veracross.Data().PATCH(
          '/academics/classes/{id}',
          {
            params: { path: { id: c.id } },
            body: { data: { description } }
          }
        );
        if (error) {
          spinner.fail(
            `${spinner.text} update failed. ${Colors.error(`Error ${error.error_id}: ${error.error}`)}`
          );
        }
      }
      spinner.succeed(
        `${spinner.text} ${config.dryRun ? 'would be ' : ''}updated to ${Colors.value(description)}`
      );
    } else {
      spinner.info(
        `${spinner.text} ${config.dryRun ? 'would be ' : ''}unchanged`
      );
    }
  }
}
