import { PathString } from '@battis/descriptive-types';
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

export type Configuration = Plugin.Configuration & { pathToCsv?: PathString };

type PatchData = NonNullable<
  Veracross.API.paths['/academics/courses/{id}']['patch']['requestBody']
>['content']['application/json']['data'];

const PAGE_SIZE = 100;

const config: Configuration = {};

const scope = ['academics.classes:list', 'academics.classes:update'];

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
        `${Colors.value('internal_class_id')} and one other column with the ` +
        `name of an API accessible course field.`
    }
  });
  Positionals.allowOnlyNamedArgs();
  return {
    man: [
      { level: 1, text: 'Class Update' },
      {
        text:
          `This command will review the provided CSV and check the ` +
          `provided course values against the list of classes in Veracross. ` +
          `Any differences between the CSV value and the database value will ` +
          `be updated to reflect the CSV.`
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ]
  };
}

export function init() {
  const pathToCSV = Positionals.get('pathToCsv');
  configure({ pathToCSV });
  Veracross.configure({
    reason: 'vc classes update',
    credentials: { scope }
  });
}

export async function run() {
  if (!config.pathToCsv) {
    throw new Error(`${Colors.positionalArg('pathToCsv')} is required.`);
  }
  let proposal: ({ internal_course_id: string } & PatchData)[] = parse(
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
    const {
      data: { data } = {},
      error,
      response
    } = await Veracross.Data.GET('/academics/classes', {
      params: { header: { 'X-Page-Number': page } }
    });
    if (!data) {
      throw new Error('Expected data missing from response', {
        cause: {
          error,
          response: {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: await response.text()
          }
        }
      });
    }
    max += data.length;
    Progress.setMax(max);
    Progress.caption(`Page ${page} of data`);

    for (const retrieved of data) {
      const i = proposal.findIndex(
        (row) => parseInt(row.internal_course_id) == retrieved.id
      );
      if (i >= 0) {
        Progress.caption(proposal[i].name || retrieved.description);
        const patch: PatchData = {};
        for (const key of Object.keys(proposal[i]) as (keyof {
          internal_course_id: number;
        } &
          PatchData)[]) {
          if (
            key !== 'internal_course_id' &&
            proposal[i][key] &&
            proposal[i][key] != retrieved[key]
          ) {
            patch[key] = proposal[i][key];
          }
        }
        if (Object.keys(patch).length > 0) {
          const { response } = await Veracross.Data.PATCH(
            '/academics/classes/{id}',
            {
              params: {
                path: { id: retrieved.id },
                body: { data: patch }
              }
            }
          );
          if (response.status === 204) {
            updated++;
            Log.debug({
              id: retrieved.id,
              retrieved,
              proposal: proposal[i],
              patch
            });
          } else {
            throw new Error(
              `Failed to update course ${Colors.value(retrieved.id)}`,
              {
                cause: {
                  response: {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: await response.text()
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
    done = proposal.length === 0 || data.length < PAGE_SIZE;
    if (!done) {
      page = page + 1;
    }
  } while (!done);
  Progress.stop();
  Log.debug({ updated, unchanged, remaining: proposal });
}
