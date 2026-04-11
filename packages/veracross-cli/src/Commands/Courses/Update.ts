import { DateString, PathString } from '@battis/descriptive-types';
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
  pathToCsv?: PathString;
};

type Course = {
  id: number;
  course_id: string;
  name: string;
  subject_id: number;
  subject_description: string;
  department_id: number;
  department_description: string;
  catalog_title: string;
  catalog_description: string;
  classification: number;
  course_type: string;
  last_modified_date: DateString<'MM/DD/YYYY'>;
};

type CoursePatch = {
  course_id?: string;
  name?: string;
  subject_id?: number;
  subject_description?: string;
  department_description?: string;
  catalog_title?: string;
  catalog_description?: string;
  classification?: number;
  course_type?: number;
};

const PAGE_SIZE = 100;

const scope = ['academics.courses:list', 'academics.courses:update'];

const config: Configuration = {};

export function configure(proposal: Configuration = {}) {
  for (const key in proposal) {
    if (proposal[key] !== undefined) {
      config[key] = proposal[key];
    }
  }
}

export function options(): Plugin.Options {
  Positionals.require({
    pathToCsv: {
      description:
        `The relative path to a CSV file containing at least the column ` +
        `${Colors.value('internal_course_id')} and one other column with the ` +
        `name of an API accessible course field.`
    }
  });
  Positionals.allowOnlyNamedArgs();
  return {
    man: [
      { level: 1, text: 'Course Update' },
      {
        text:
          `This command will review the provided CSV and check the ` +
          `provided course values against the list of courses in Veracross. ` +
          `Any differences between the CSV value and the database value will ` +
          `be updated to reflect the CSV.`
      }
    ]
  };
}

export function init() {
  configure({ pathToCsv: Positionals.get('pathToCsv') });
  Veracross.configure({
    credentials: {
      scope
    }
  });
}

export async function run() {
  if (!config.pathToCsv) {
    throw new Error(`${Colors.positionalArg('pathToCsv')} is required.`);
  }
  let proposal: ({ internal_course_id: string } & CoursePatch)[] = parse(
    fs.readFileSync(path.resolve(Root.path(), config.pathToCsv)),
    {
      columns: true
    }
  );

  let done = false;
  let max = 0;
  let page = 1;
  let updated = 0;
  let unchanged = 0;

  Progress.start({ max });
  do {
    const response = await Veracross.requestRaw(
      'v3/academics/courses',
      'GET',
      undefined,
      { 'X-Page-Number': page, 'X-Page-Size': PAGE_SIZE }
    );
    const {
      'x-page-number': pageNumber = page,
      'x-page-size': pageSize = PAGE_SIZE
    } = (Array.from(response.headers.entries()) as [string, string][]).reduce(
      (record, [key, value]) => {
        record[key.toLowerCase()] = parseInt(value);
        return record;
      },
      {} as Record<string, number>
    );
    const { data } = (await Veracross.client().processResponse(response)) as {
      data: Course[];
    };
    max += data.length;
    Progress.setMax(max);
    Progress.caption(`Page ${page} of data`);

    for (const course of data) {
      const i = proposal.findIndex(
        (row) => parseInt(row.internal_course_id) == course.id
      );
      if (i >= 0) {
        Progress.caption(proposal[i].name || course.name);
        const update: CoursePatch = {};
        for (const key of Object.keys(proposal[i]) as (keyof {
          internal_course_id: number;
        } &
          CoursePatch)[]) {
          if (
            key !== 'internal_course_id' &&
            proposal[i][key] &&
            proposal[i][key] != course[key]
          ) {
            update[key] = proposal[i][key];
          }
        }
        if (Object.keys(update).length > 0) {
          const updateResponse = await Veracross.requestRaw(
            `v3/academics/courses/${course.id}`,
            'PATCH',
            JSON.stringify({ data: update }),
            { 'Content-Type': 'application/json' }
          );
          if (updateResponse.status === 204) {
            updated++;
            Log.debug({
              id: course.id,
              original: course,
              proposal: proposal[i],
              update
            });
          } else {
            throw new Error(
              `Failed to update course ${Colors.value(course.id)}`,
              {
                cause: {
                  response: {
                    ok: updateResponse.ok,
                    status: updateResponse.status,
                    statusText: updateResponse.statusText,
                    headers: Object.fromEntries(
                      updateResponse.headers.entries()
                    ),
                    body: await updateResponse.text()
                  }
                }
              }
            );
          }
        } else {
          unchanged++;
        }
        proposal.splice(i, 1);
      }
      Progress.increment();
    }
    done = proposal.length === 0 || data.length < pageSize;
    if (!done) {
      page = pageNumber + 1;
    }
  } while (!done);
  Progress.stop();
  Log.debug({ updated, unchanged, remaining: proposal });
}
