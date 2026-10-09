import fs from 'node:fs';
import path from 'node:path';
import { PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import { parse, stringify } from 'csv/sync';
import ora from 'ora';
import { CSV, DateString, PartialUpdate } from '../../../lib/index.js';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
};

type RosterUpdate = {
  school_year: number;
  internal_class_id: number;
  person_id: number;
} & Veracross.Data.Athletics.Rosters.RosterPatch;

const scope = [
  Veracross.Data.Athletics.Rosters.LIST_SCOPE,
  Veracross.Data.Athletics.Rosters.UPDATE_SCOPE
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
  const data: RosterUpdate[] = parse(fs.readFileSync(pathToCSV), {
    columns: true,
    bom: true,
    cast: CSV.cast({
      exclude_from_transcript: 'boolean',
      captain: 'boolean',
      lettered: 'boolean',
      id: 'int',
      jersey_size: 'int',
      jersey_number: 'non-empty-string',
      height: 'non-empty-string',
      weight: 'non-empty-string',
      position: 'non-empty-string',
      internal_class_id: 'int',
      person_id: 'int',
      grade_level_id: 'int'
    })
  });

  const errors: (RosterUpdate & { row: number; error: string })[] = [];
  const errorsPath = path.resolve(
    path.dirname(pathToCSV),
    `${path.basename(pathToCSV, path.extname(pathToCSV))} - errors${path.extname(pathToCSV)}`
  );

  for (let i = 0; i < data.length; i++) {
    const { person_id, internal_class_id, school_year, ...proposal } = data[i];
    const identifier = `Person ID ${Colors.value(person_id)} / Internal Class ID ${Colors.value(internal_class_id)}`;
    const spinner = ora(identifier).start();
    try {
      const [roster] = await Veracross.Data.Athletics.Rosters.list({
        query: { internal_class_id, person_id, school_year }
      });
      if (!roster) {
        throw new Error('not found');
      }
      const update = PartialUpdate.minimal(
        roster,
        PartialUpdate.omit(proposal, ['first_name', 'last_name', 'suffix']),
        (key, a, b) => {
          switch (key) {
            case 'late_date_enrolled':
            case 'date_withdrawn':
              return (
                typeof a === 'string' &&
                typeof b === 'string' &&
                DateString.isEqual(a, b)
              );
            default:
              return a == b;
          }
        }
      );
      if (update) {
        spinner.text = `Update ${identifier}: ${Log.syntaxColor(update).replaceAll(/\s+|\n/g, ' ')}`;
        await Veracross.Data.Athletics.Rosters.update({
          id: roster.id,
          data: update
        });
        spinner.succeed();
      } else {
        spinner.info(`${identifier}: no update necessary`);
      }
    } catch (error) {
      errors.push({ row: i + 1, ...data[i], error: JSON.stringify(error) });
      fs.writeFileSync(errorsPath, stringify(errors, { header: true }));
      spinner.fail(`${identifier}: ${Colors.error(JSON.stringify(error))}`);
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
