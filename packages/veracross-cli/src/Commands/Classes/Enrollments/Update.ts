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

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
};

const scope = [
  'academics.enrollments:list',
  'academics.enrollments:update',
  'summer.enrollments:list',
  'summer.enrollments:update'
];

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
        `${Colors.value('person_id')} (valid Veracross Person ID values), ` +
        `${Colors.value('school_year')} (Veracross school year identifier),` +
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
      { level: 1, text: 'Class Enrollment Update' },
      {
        text:
          `This script will adjust the ${Colors.value(`late_date_enrolled`)} ` +
          `and ${Colors.value('date_withdrawn')} calues in student ` +
          `enrollments based on the provided CSV file.`
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ]
  };
}

export function init(args: Plugin.ExpectedArguments<typeof options>) {
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

  const data: {
    person_id: number;
    school_year: number;
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
    const { person_id, school_year, internal_class_id } = row;
    let endpoint: 'academics' | 'summer' = 'academics';
    if (school_year < 0) {
      endpoint = 'summer';
    }
    const { data: enrollments } = await Veracross.Data.GET(
      `/${endpoint}/enrollments`,
      { params: { query: { school_year, internal_class_id, person_id } } }
    );

    if (enrollments?.data) {
      const [enrollment] = enrollments.data;
      if (enrollment) {
        Progress.caption(
          // @ts-expect-error 2339
          `${enrollment.person_name} / ${enrollment.class_description}`
        );
        let update = false;
        if (
          row.late_date_enrolled &&
          unequal(
            row.late_date_enrolled,
            enrollment.late_date_enrolled,
            canonicalDate
          )
        ) {
          enrollment.late_date_enrolled = row.late_date_enrolled;
          update = true;
        }
        if (
          row.date_withdrawn &&
          unequal(row.date_withdrawn, enrollment.date_withdrawn, canonicalDate)
        ) {
          enrollment.date_withdrawn = row.date_withdrawn;
          update = true;
        }
        if (row.notes && unequal(row.notes, enrollment.notes)) {
          enrollment.notes = row.notes;
          update = true;
        }
        if (update) {
          const { id, late_date_enrolled, date_withdrawn, notes } = enrollment;
          const update = { late_date_enrolled, date_withdrawn, notes };
          await Veracross.Data.PATCH(`/${endpoint}/enrollments/{id}`, {
            params: { path: { id } },
            body: { data: update }
          });

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
    const errorPath = path.join(
      config.pathToCSV,
      '../' +
        path.basename(config.pathToCSV, path.extname(config.pathToCSV)) +
        '-errors.json'
    );
    fs.writeFileSync(errorPath, JSON.stringify(missing, null, 2));
    Log.warning(
      `${missing.length} records could not be found. The full list was written to ${Colors.path(errorPath)}`
    );
  }
}

function unequal(
  a?: string,
  b?: string,
  canonical: (value: string) => string = (v: string) => v
) {
  return a && (!b || canonical(a) != canonical(b));
}

function canonicalDate(value: string) {
  return new Date(
    value.replace(/^(\d{4}-\d{2}-\d{2})(?!T\d)/, '$1T00:00:00-05:00')
  ).toLocaleDateString();
}
