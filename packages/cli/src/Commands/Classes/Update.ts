import fs from 'node:fs';
import path from 'node:path';
import { PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Progress } from '@qui-cli/progress';
import { Root } from '@qui-cli/root';
import { pascalCase } from 'change-case';
import { parse } from 'csv/sync';
import { CSV } from '../../lib/index.js';

export type Configuration = Plugin.Configuration & {
  pathToCsv?: PathString;
  endpoint?:
    'academics' | 'extended-care' | 'non-academics' | 'programs' | 'summer';
};

Positionals.require({
  pathToCsv: {
    description:
      `The relative path to a CSV file containing at least the column ` +
      `${Colors.value('internal_class_id')} and one other column with the ` +
      `name of an API accessible course field.`
  }
});
Positionals.allowOnlyNamedArgs();

type PatchData<T extends Configuration['endpoint']> = {
  internal_class_id: number;
} & (T extends 'academics'
  ? Veracross.Data.Academics.Classes.ClassPatch
  : T extends 'extended-care'
    ? Veracross.Data.ExtendedCare.Classes.ClassPatch
    : T extends 'non-academics'
      ? Veracross.Data.NonAcademics.Classes.ClassPatch
      : T extends 'programs'
        ? Veracross.Data.Programs.Classes.ClassPatch
        : Veracross.Data.Summer.Classes.ClassPatch);

const config: Configuration = { endpoint: 'academics' };

const scope = [
  Veracross.Data.Academics.Classes.READ_SCOPE,
  Veracross.Data.Academics.Classes.UPDATE_SCOPE,
  Veracross.Data.ExtendedCare.Classes.READ_SCOPE,
  Veracross.Data.ExtendedCare.Classes.UPDATE_SCOPE,
  Veracross.Data.NonAcademics.Classes.READ_SCOPE,
  Veracross.Data.NonAcademics.Classes.UPDATE_SCOPE,
  Veracross.Data.Programs.Classes.READ_SCOPE,
  Veracross.Data.Programs.Classes.UPDATE_SCOPE,
  Veracross.Data.Summer.Classes.READ_SCOPE,
  Veracross.Data.Summer.Classes.UPDATE_SCOPE
];

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
        hint: 'Academics|ExtendedCare|NonAcademics|Programs|Summer',
        default: config.endpoint
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  const pathToCsv = Positionals.get('pathToCsv');
  // @ts-expect-error 2345
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

  const proposals: PatchData<typeof config.endpoint>[] = parse(
    fs.readFileSync(path.resolve(Root.path(), config.pathToCsv)),
    {
      columns: true,
      cast: CSV.cast({ internal_class_id: 'int' })
    }
  );

  const updated: PatchData<typeof config.endpoint>[] = [];
  const unchanged: PatchData<typeof config.endpoint>[] = [];
  const missing: PatchData<typeof config.endpoint>[] = [];

  Progress.start({ max: proposals.length });

  for (const proposal of proposals) {
    // @ts-expect-error 7053 pascalCase will transform endpoint to module name
    const retrieved = await Veracross.Data[
      pascalCase(config.endpoint)
    ].Classes.read({
      id: proposal.internal_class_id
    });
    Progress.caption(
      proposal.description ||
        retrieved?.description ||
        `Internal Class ID ${proposal.internal_class_id}`
    );
    if (retrieved) {
      const patch: Omit<
        PatchData<typeof config.endpoint>,
        'internal_class_id'
      > = {};
      for (const key of Object.keys(proposal) as (keyof PatchData<
        typeof config.endpoint
      >)[]) {
        if (
          key !== 'internal_class_id' &&
          key in retrieved &&
          proposal[key] &&
          proposal[key] != retrieved[key]
        ) {
          // @ts-expect-error 2322 prior typechecks avoid mismatches
          patch[key] = proposal[key];
        }
      }
      if (Object.keys(patch).length > 0) {
        // @ts-expect-error 7053 pascalCase will transform endpoint to module name
        await Veracross.Data[pascalCase(config.endpoint)].Classes.update({
          id: retrieved.id,
          data: patch
        });
      } else {
        unchanged.push(proposal);
      }
    } else {
      missing.push(proposal);
    }
    Progress.increment();
  }
  Progress.stop();
  Log.debug({ updated, unchanged, missing });
}
