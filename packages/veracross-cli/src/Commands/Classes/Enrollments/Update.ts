import { DateString, PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import { parse, stringify } from 'csv/sync';
import fs from 'node:fs';
import path from 'node:path';
import { ArrayElement } from '@battis/typescript-tricks';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
};

interface EnrollmentUpdate {
  person_id: number;
  internal_class_id: number;
  school_year: number;
  late_date_enrolled?: DateString;
  date_withdrawn?: DateString;
  notes?: string;
  exclude_from_transcript?: boolean;
}

const scope = [
  'academics.enrollments:list',
  'academics.enrollments:update',
  'summer.enrollments:list',
  'summer.enrollments:update'
];

Positionals.require({
  pathToCsv: {
    description:
      `Path to a CSV file containing the columns ` +
      `${Colors.value('person_id')} (valid Veracross Person ID values), ` +
      `${Colors.value('internal_class_id')} (a valid Veracross internal ` +
      `class ID values), ${Colors.value('late_date_enrolled')} (optional ` +
      `date for late enrollment), ${Colors.value('date_withdrawn')} ` +
      `(optional date for withdrawal), and ${Colors.value('notes')} ` +
      `(optional notes about the enrollment), and/or ` +
      `${Colors.varName('exclude_from_transcript')} (optional boolean to ` +
      `exclude that person's grades in that class from their transcript).`
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
          `This script will adjust the metadata in student ` +
          `enrollments based on the provided CSV file.`
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
    const endpoints: ('academics' | 'summer' | undefined)[] =
      school_year > 0 ? ['academics'] : ['summer'];
    let enrollment:
      | ArrayElement<
          Veracross.Types.spec.DataAPI.paths['/academics/enrollments']['get']['responses']['200']['content']['application/json']['data']
        >
      | ArrayElement<
          Veracross.Types.spec.DataAPI.paths['/summer/enrollments']['get']['responses']['200']['content']['application/json']['data']
        >
      | undefined = undefined;
    let endpoint: ArrayElement<typeof endpoints>;
    for (endpoint = endpoints.shift(); endpoint && !enrollment;) {
      spinner.text = `${identifier}: searching ${Colors.value(endpoint)}`;
      const { data, error } = await Veracross.Data().GET(
        `/${endpoint}/enrollments`,
        {
          params: { query: { person_id, internal_class_id, school_year } }
        }
      );
      if (error || !data.data.length) {
        endpoint = endpoints.shift();
      } else {
        // there really can only be one!
        enrollment = data.data.shift();
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
        const { error } = await Veracross.Data().PATCH(
          `/${endpoint}/enrollments/{id}`,
          { params: { path: { id: enrollment.id } }, body: { data: update } }
        );
        if (error) {
          errors.push({ row: i + 1, ...data[i], error: error.error });
          fs.writeFileSync(errorsPath, stringify(errors, { header: true }));
          spinner.fail(`${spinner.text}: ${Colors.error(error.error)}`);
        } else {
          spinner.succeed();
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
