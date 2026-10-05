import fs from 'node:fs';
import path from 'node:path';
import { PathString } from '@battis/descriptive-types';
import confirm from '@inquirer/confirm';
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

interface Suppression {
  grade_id: number;
  person_id: number;
  internal_class_id: number;
  grading_period: string;
  posted_grade: number;
}

const scope = [
  Veracross.Data.Academics.Config.GradingPeriods.LIST_SCOPE,
  Veracross.Data.Academics.NumericGrades.READ_SCOPE,
  Veracross.Data.Academics.NumericGrades.UPDATE_SCOPE
];

Positionals.require({
  pathToCsv: {
    description: `Path to a CSV file of grades to suppress`
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
      { level: 1, text: 'Suppress Grades' },
      {
        text: `Suppress (delete) grades. This is a destructive process, meant to be run as the last step in processing report card updates for students who have switched sections.`
      },
      {
        text: `The CSV file at ${Colors.positionalArg('pathToCsv')} ${Colors.keyword('must')} include the following columns:`
      },
      {
        text: `  - ${Colors.varName('grade_id')} (valid Veracross posted grade ID)`
      },
      {
        text: `  - ${Colors.varName('person_id')} (valid Veracross student person IDs)`
      },
      {
        text: `  - ${Colors.varName('internal_class_id')} (valid Veracross class IDs)`
      },
      {
        text: `  - ${Colors.varName('grading_period')} (valid grading period abbreviations)`
      },
      {
        text: `  - ${Colors.varName('posted_grade')} (previously posted numeric grade that to be suppressed)`
      },
      {
        text: `Grades will ${Colors.keyword('only')} be suppressed if all ID values and the grade value match.`
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
    reason: 'vc grades suppress',
    credentials: { scope }
  });
}

export async function run() {
  if (
    !(await confirm({
      message: `This is a destructive process. Are you sure that you want to proceed?`
    }))
  ) {
    Log.info('Grade suppression aborted.');
    process.exit(0);
  }
  if (
    !(await confirm({
      message: `This is the last step in preparing grades for report cards. You should already have imported the section switch grade insertions that match these grades that are about to be suppressed. Have you done that?`
    }))
  ) {
    Log.info('Grade supporession aborted.');
    process.exit(0);
  }

  if (!config.pathToCSV) {
    throw new Error(`${Colors.positionalArg('pathToCSV')} is required`);
  }

  const pathToCSV = path.resolve(Root.path(), config.pathToCSV);
  const data: Suppression[] = parse(fs.readFileSync(pathToCSV), {
    columns: true
  });

  const spinner = ora('Retrieving grading periods').start();
  const gradingPeriods: Record<string, number> = {};
  try {
    const gradingPeriodResponse =
      await Veracross.Data.Academics.Config.GradingPeriods.list({});
    for (const gradingPeriod of gradingPeriodResponse) {
      gradingPeriods[gradingPeriod.abbreviation] = gradingPeriod.id;
    }
    spinner.succeed(
      `${Object.keys(gradingPeriods).length} grading periods loaded`
    );
  } catch (error) {
    spinner.fail(`Error retrieving grading periods: ${error}`);
    process.exit(1);
  }

  const errors: (Suppression & { row: number; error: string })[] = [];
  const errorsPath = path.resolve(
    path.dirname(pathToCSV),
    `${path.basename(pathToCSV, path.extname(pathToCSV))} - errors${path.extname(pathToCSV)}`
  );

  for (let i = 0; i < data.length; i++) {
    const {
      grade_id,
      person_id,
      internal_class_id,
      grading_period,
      posted_grade
    } = data[i];
    const identifier = `Grade ID ${Colors.value(grade_id)}`;
    const spinner = ora(identifier).start();
    try {
      const grade = await Veracross.Data.Academics.NumericGrades.read({
        id: grade_id
      });
      if (grade) {
        if (grade.student.id == person_id) {
          if (grade.class.id == internal_class_id) {
            if (grade.grading_period.id == gradingPeriods[grading_period]) {
              if (grade.posted_grade == posted_grade) {
                await Veracross.Data.Academics.NumericGrades.update({
                  id: grade_id,
                  data: { posted_grade: 0 }
                });
                spinner.succeed(
                  `${identifier}: suppressed ${Colors.value(
                    `${grade?.student.name.replace(/^(.+), (.+)$/, '$2 $1')}'s`
                  )} grade of ${Colors.value(grade?.posted_grade)} for ${Colors.value(
                    grade?.class.description
                  )} in ${Colors.value(grade?.grading_period.description)} term`
                );
              } else {
                throw new Error(`grade mismatch: found ${grade.posted_grade}`);
              }
            } else {
              throw new Error(
                `grading period mismatch: found ${grade.grading_period.description}`
              );
            }
          } else {
            throw new Error(`class id mismatch: found ${grade.class.id}`);
          }
        } else {
          throw new Error(`student id mismatch: found ${grade.student.id}`);
        }
      } else {
        throw new Error('not found');
      }
    } catch (error) {
      errors.push({ row: i + 1, ...data[i], error: JSON.stringify(error) });
      fs.writeFileSync(errorsPath, stringify(errors, { header: true }));
      spinner.fail(`${identifier}: ${Colors.error(error)}`);
    }
  }

  Log.info(`${data.length - errors.length} grades suppressed.`);
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
