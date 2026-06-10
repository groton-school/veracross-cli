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

export type Configuration = Plugin.Configuration & {
  pathToCsv?: PathString;
  endpoint?:
    | 'academics'
    | 'extended_care'
    | 'non-academics'
    | 'programs'
    | 'summer';
};

type PatchData = NonNullable<
  Veracross.DataAPI.paths['/academics/courses/{id}']['patch']['requestBody']
>['content']['application/json']['data'];

const PAGE_SIZE = 100;

const config: Configuration = { endpoint: 'academics' };

const scope = [
  'academics.classes:read',
  'academics.classes:update',
  'extended_care.classes:update',
  'extended_care.classes:read',
  'non-academics.classes:read',
  'non-academics.classes:update',
  'programs.classes:update',
  'programs.classes:read',
  'summer.classes:read',
  'summer.classes:update'
];

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
    ],
    opt: {
      endpoint: {
        description: 'Class endpoint to use',
        hint: 'academics|extended_care|non-academics|programs|summer',
        default: config.endpoint
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  const pathToCsv = Positionals.get('pathToCsv');
  configure({ pathToCsv, ...values });
  Veracross.configure({
    reason: 'vc classes update',
    credentials: { scope }
  });
}

export async function run() {
  if (!config.pathToCsv) {
    throw new Error(`${Colors.positionalArg('pathToCsv')} is required.`);
  }
  if (!config.endpoint) {
    throw new Error(`${Colors.optionArg('--endpoint')} is required`);
  }
  let proposals: ({ internal_class_id: string } & PatchData)[] = parse(
    fs.readFileSync(path.resolve(Root.path(), config.pathToCsv)),
    {
      columns: true
    }
  );

  let done = false;
  let page = 1;
  const updated: PatchData[] = [];
  const unchanged: PatchData[] = [];
  const missing: PatchData[] = [];

  Progress.start({ max: proposals.length });

  for (const proposal of proposals) {
    const { data: { data: retrieved } = {} } = await Veracross.Data().GET(
      `/${config.endpoint}/classes/{id}`,
      { params: { path: { id: parseInt(proposal.internal_class_id) } } }
    );
    Progress.caption(
      proposal.name ||
        retrieved?.description ||
        `Internal Class ID ${proposal.internal_class_id}`
    );
    if (retrieved) {
      const patch: PatchData = {};
      for (const key of Object.keys(proposal) as (keyof {
        internal_class_id: number;
      } &
        PatchData)[]) {
        if (
          key !== 'internal_class_id' &&
          key in retrieved &&
          proposal[key] &&
          proposal[key] != retrieved[key]
        ) {
          patch[key] = proposal[key];
        }
      }
      if (Object.keys(patch).length > 0) {
        const { response, error } = await Veracross.Data().PATCH(
          `/${config.endpoint}/classes/{id}`,
          {
            params: {
              path: { id: retrieved.id }
            },
            body: { data: patch }
          }
        );
        if (response.status === 204) {
          updated.push(patch);
          Log.debug({
            id: retrieved.id,
            retrieved,
            proposal,
            patch
          });
        } else {
          throw new Error(
            `Failed to update course ${Colors.value(retrieved.id)}`,
            {
              cause: {
                retrieved,
                patch,
                response: {
                  ok: response.ok,
                  status: response.status,
                  statusText: response.statusText,
                  headers: Object.fromEntries(response.headers.entries())
                },
                error
              }
            }
          );
        }
      } else {
        unchanged.push(retrieved);
      }
    } else {
      missing.push(proposal);
    }
    Progress.increment();
  }
  Progress.stop();
  Log.debug({ updated, unchanged, missing });
}
