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

const scope = [
  Veracross.Data.Academics.Classes.LIST_SCOPE,
  Veracross.Data.Academics.Classes.UPDATE_SCOPE
];

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

export function options() {
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
  const classes = await Veracross.Data.Academics.Classes.list({
    query: { school_year: config.schoolYear }
  });
  for (const c of classes) {
    const spinner = ora(Colors.value(c.description)).start();
    const description = c.description.replace(
      // @ts-expect-error 2769 already tested that at least one is defined above
      config.needle || config.regex,
      config.replace
    );
    if (description !== c.description) {
      if (!config.dryRun) {
        try {
          await Veracross.Data.Academics.Classes.update({
            id: c.id,
            data: { description }
          });
          spinner.succeed(
            `${spinner.text} ${config.dryRun ? 'would be ' : ''}updated to ${Colors.value(description)}`
          );
        } catch (error) {
          spinner.fail(
            `${spinner.text} update failed. ${Colors.error(`Error ${error}`)}`
          );
        }
      }
    } else {
      spinner.info(
        `${spinner.text} ${config.dryRun ? 'would be ' : ''}unchanged`
      );
    }
  }
}
