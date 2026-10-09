import fs from 'node:fs';
import path from 'node:path';
import { PathString } from '@battis/descriptive-types';
import { ArrayElement } from '@battis/typescript-tricks';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import { parse, stringify } from 'csv/sync';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
};

type EnrollmentUpdate = {
  person_id: number;
  internal_class_id: number;
  school_year: number;
} & Veracross.Data.Academics.Enrollments.EnrollmentPatch;

const scope = [
  Veracross.Data.Academics.Enrollments.LIST_SCOPE,
  Veracross.Data.Academics.Enrollments.UPDATE_SCOPE,
  Veracross.Data.Summer.Enrollments.LIST_SCOPE,
  Veracross.Data.Summer.Enrollments.UPDATE_SCOPE
];

Positionals.require({
  pathToCsv: {
    description: `Path to a CSV file of enrollment updates`
  }
});
Positionals.allowOnlyNamedArgs();

const config: Configuration = {};

export function configure(proposal: Configuration = {}) {
  for (const prop in proposal) {
    if (proposal[prop] !== undefined) {
      config[prop] = proposal[prop];
    }
  }
}

export function options(): Plugin.Options {
  return {
    man: [
      { level: 1, text: 'Class Enrollment Update' },
      {
        text:
          `Update enrollments whose data differes from that provided in ` +
          `${Colors.positionalArg('pathToCsv')}. The CSV file provided must ` +
          `include the columns ${Colors.value('person_id')} (valid Veracross ` +
          `Person ID values), ${Colors.value('internal_class_id')} (valid ` +
          `Veracross internal class ID values), ` +
          `${Colors.value('late_date_enrolled')} (optional dates for late ` +
          `enrollment), ${Colors.value('date_withdrawn')} (optional dates for ` +
          `withdrawal), and ${Colors.value('notes')} (optional notes about ` +
          `the enrollment), and/or ` +
          `${Colors.varName('exclude_from_transcript')} (optional boolean to ` +
          `exclude that person's grades in that class from their transcript).`
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ]
  };
}

export function init(_: Plugin.ExpectedArguments<typeof options>) {
  const pathToCSV = Positionals.get('pathToCsv');
  configure({ pathToCSV });
  Veracross.configure({
    reason: 'vc classes enrollments update',
    credentials: { scope }
  });
}

export async function run() {
  if (!config.pathToCSV) {
    throw new Error(`${Colors.positionalArg('pathToCSV')} is required`);
  }

  const pathToCSV = path.resolve(Root.path(), config.pathToCSV);
  const data: EnrollmentUpdate[] = parse(fs.readFileSync(pathToCSV), {
    columns: true,
    bom: true,
    cast: (value, context) => {
      if (context.column === 'exclude_from_transcript') {
        return value.toUpperCase() === 'TRUE'
          ? true
          : value.toLowerCase() === 'FALSE'
            ? false
            : undefined;
      }
      return value;
    }
  });

  const errors: (EnrollmentUpdate & { row: number; error: string })[] = [];
  const errorsPath = path.resolve(
    path.dirname(pathToCSV),
    `${path.basename(pathToCSV, path.extname(pathToCSV))} - errors${path.extname(pathToCSV)}`
  );

  for (let i = 0; i < data.length; i++) {
    const {
      person_id,
      internal_class_id,
      school_year,
      late_date_enrolled,
      date_withdrawn,
      notes,
      exclude_from_transcript
    } = data[i];
    const identifier = `Person ID ${Colors.value(person_id)} / Internal Class ID ${Colors.value(internal_class_id)}`;
    const spinner = ora(identifier).start();
    const endpoints: ('Academics' | 'Summer' | undefined)[] =
      school_year > 0 ? ['Academics'] : ['Summer'];
    let enrollment:
      | Veracross.Data.Academics.Enrollments.Enrollment
      | Veracross.Data.Summer.Enrollments.Enrollment
      | undefined = undefined;
    let endpoint: ArrayElement<typeof endpoints>;
    for (endpoint = endpoints.shift(); endpoint && !enrollment;) {
      spinner.text = `${identifier}: searching ${Colors.value(endpoint)}`;

      try {
        const [e] = await Veracross.Data[endpoint].Enrollments.list({
          query: { person_id, internal_class_id, school_year }
        });
        if (!enrollment) {
          throw Error();
        }
        enrollment = e;
      } catch (_) {
        endpoint = endpoints.shift();
      }
    }

    if (endpoint && enrollment) {
      const update: Partial<
        Omit<EnrollmentUpdate, 'person_id' | 'internal_class_id'>
      > = {};
      if (
        late_date_enrolled &&
        unequalDates(late_date_enrolled, enrollment.late_date_enrolled)
      ) {
        update.late_date_enrolled = late_date_enrolled;
      }
      if (
        date_withdrawn &&
        unequalDates(date_withdrawn, enrollment.date_withdrawn)
      ) {
        update.date_withdrawn = date_withdrawn;
      }
      if (notes && notes !== enrollment.notes) {
        update.notes = notes;
      }
      if (
        exclude_from_transcript !== undefined &&
        exclude_from_transcript !== enrollment.exclude_from_transcript
      ) {
        update.exclude_from_transcript = exclude_from_transcript;
      }
      if (Object.keys(update).length > 0) {
        spinner.text = `Update ${identifier}: ${Log.syntaxColor(update).replaceAll(/\s+|\n/g, ' ')}`;
        try {
          await Veracross.Data[endpoint].Enrollments.update({
            id: enrollment.id,
            data: update
          });
          spinner.succeed();
        } catch (error) {
          errors.push({ row: i + 1, ...data[i], error: JSON.stringify(error) });
          fs.writeFileSync(errorsPath, stringify(errors, { header: true }));
          spinner.fail(
            `${spinner.text}: ${Colors.error(JSON.stringify(error))}`
          );
        }
      } else {
        spinner.info(`${identifier}: no update necessary`);
      }
    } else {
      errors.push({ row: i + 1, ...data[i], error: 'not found' });
      fs.writeFileSync(errorsPath, stringify(errors, { header: true }));
      spinner.fail(`${identifier}: ${Colors.error('not found')}`);
    }
  }

  Log.info(`${data.length - errors.length} enrollments updated.`);
  if (errors.length) {
    const errorsPath = path.resolve(
      path.dirname(pathToCSV),
      `${path.basename(pathToCSV, path.extname(pathToCSV))} - errors${path.extname(pathToCSV)}`
    );
    Log.error(
      `${errors.length} errors occurred. Details written to ${Colors.path(errorsPath)}`
    );
  }
}

function unequalDates(a?: string, b?: string) {
  return a && (!b || canonicalDate(a) != canonicalDate(b));
}

function canonicalDate(value: string) {
  return new Date(
    value.replace(/^(\d{4}-\d{2}-\d{2})(?!T\d)/, '$1T00:00:00-05:00')
  ).toLocaleDateString();
}
