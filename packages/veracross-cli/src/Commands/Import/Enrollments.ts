import { DateString, PathString, URLString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Progress } from '@qui-cli/progress';
import { Root } from '@qui-cli/root';
import { parse } from 'csv/sync';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import * as requestish from 'requestish';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
};

const scope = ['academics.enrollments:list', 'academics.enrollments:update'];

const config: Configuration = {};

export function configure(proposal: Configuration = {}) {
  for (const prop in proposal) {
    if (proposal[prop] !== undefined) {
      config[prop] = proposal[prop];
    }
  }
}

export function options(): Plugin.Options {
  Positionals.require({
    pathToCsv: {
      description:
        `Path to a CSV file containing the columns ` +
        `${Colors.value('person_id')} (valid Veracross Person ID values). ` +
        `${Colors.value('internal_class_id')} (a valid Veracross internal ` +
        `class ID values), ${Colors.value('late_date_enrolled')} (optional ` +
        `dates for late enrollment), ${Colors.value('date_withdrawn')} ` +
        `(optional dates for withdrawal), and ${Colors.value('notes')} (comments on the enrollment). ${Colors.value('person_id')}-` +
        `${Colors.value('internal_course_id')} pairs should be unique (the last ` +
        ` value for a given pairing will be the one that is applied).`
    }
  });
  Positionals.allowOnlyNamedArgs();
  return {
    man: [
      { level: 1, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ]
  };
}

export function init(args: Plugin.ExpectedArguments<typeof options>) {
  const pathToCSV = Positionals.get('pathToCsv');
  configure({ pathToCSV });
  Veracross.configure({
    credentials: {
      scope
    }
  });
}

export async function run() {
  if (!config.pathToCSV) {
    throw new Error(`${Colors.positionalArg('pathToCSV')} is required`);
  }

  const data: {
    person_id: number;
    internal_class_id: number;
    late_date_enrolled?: DateString;
    date_withdrawn?: DateString;
    notes?: string;
  }[] = parse(fs.readFileSync(path.resolve(Root.path(), config.pathToCSV)), {
    columns: true
  });

  Progress.start({ max: data.length });
  let updates = 0;
  let missing: { person_id: number; internal_class_id: number }[] = [];
  for (const row of data) {
    const enrollments = await Veracross.request<{
      data: {
        id: number;
        person_name?: string;
        class_description?: string;
        late_date_enrolled?: DateString<'YYYY-MM-DD'>;
        date_withdrawn?: DateString<'YYYY-MM-DD'>;
        notes?: string;
      }[];
    }>(
      `v3/academics/enrollments${requestish.URLSearchParams.toString({ internal_class_id: row.internal_class_id, person_id: row.person_id })}`
    );
    if ('data' in enrollments) {
      const [enrollment] = enrollments.data;
      if (enrollment) {
        Progress.caption(
          `${enrollment.person_name} / ${enrollment.class_description}`
        );
        let update = false;
        if (
          row.late_date_enrolled &&
          (!enrollment.late_date_enrolled ||
            new Date(row.late_date_enrolled).toLocaleDateString() !=
              new Date(enrollment.late_date_enrolled).toLocaleDateString())
        ) {
          enrollment.late_date_enrolled = row.late_date_enrolled;
          update = true;
        }
        if (
          row.date_withdrawn &&
          (!enrollment.date_withdrawn ||
            new Date(row.date_withdrawn).toLocaleDateString() !=
              new Date(enrollment.date_withdrawn).toLocaleDateString())
        ) {
          enrollment.date_withdrawn = row.date_withdrawn;
          update = true;
        }
        if (row.notes && (!enrollment.notes || row.notes != enrollment.notes)) {
          enrollment.notes = row.notes;
          update = true;
        }
        if (update) {
          const { id, late_date_enrolled, date_withdrawn, notes } = enrollment;
          const update = { late_date_enrolled, date_withdrawn, notes };
          try {
            await Veracross.request(
              `v3/academics/enrollments/${id}`,
              'PATCH',
              JSON.stringify({ data: update }),
              { 'Content-Type': 'application/json' }
            );
          } catch (error) {
            if (
              error &&
              typeof error === 'object' &&
              'cause' in error &&
              error.cause &&
              typeof error.cause === 'object' &&
              'error' in error.cause &&
              error.cause.error &&
              typeof error.cause.error === 'object' &&
              'cause' in error.cause.error &&
              error.cause.error.cause &&
              typeof error.cause.error.cause === 'object' &&
              'body' in error.cause.error.cause &&
              error.cause.error.cause.body === ''
            ) {
              //
            } else {
              throw new Error('Unexpected response', { cause: error });
            }
          }
          updates++;
        }
      } else {
        missing.push(row);
      }
    }
    Progress.increment();
  }
  Progress.stop();
  Log.info(`${updates} of ${data.length} enrollments required updates.`);
  if (missing.length) {
    Log.warning(
      `The following records could not be found: ${Log.syntaxColor(missing)}`
    );
  }
}
