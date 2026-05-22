import { PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import { parse } from 'csv/sync';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
  resourceIds?: number[];
  eventIds?: number[];
};

const scope = ['resource_reservations.reservations:create'];

const config: Configuration = {
  resourceIds: [],
  eventIds: []
};

export function configure(proposal: Configuration = {}) {
  for (const prop in proposal) {
    if (proposal[prop] !== undefined) {
      config[prop] = proposal[prop];
    }
  }
}

export function options(): Plugin.Options {
  Positionals.require({
    pathToCSV: {
      description:
        `Path to a CSV file containing at least ${Colors.value('resource_id')} ` +
        `and ${Colors.value('event_id')} columns. Either column may be a comma-` +
        `delineated list of IDs, in which case all the resources will be paired ` +
        `with all the events.`
    }
  });
  Positionals.allowOnlyNamedArgs();
  Positionals.requireAtLeast(0);
  return {
    man: [
      { level: 1, text: 'Resource Reservation Options' },
      {
        text:
          `If multiple ${Colors.optionArg('--resourceId')} or ` +
          `${Colors.optionArg('--eventId')} values are provided, all resources ` +
          `will be paired with all events.`
      },
      {
        text:
          'If both the the command line options and a CSV file are ' +
          'provided, the command line options will be processed first'
      },
      { level: 2, text: 'Required Veracross API scopes' },
      ...scope.map((s) => ({ text: Colors.value(s) }))
    ],
    numList: {
      resourceId: {
        description: `Internal ID of a resource to be reserved`,
        short: 'r'
      },
      eventId: {
        description: `Internal ID of an event to schedule the reservation`,
        short: 'e'
      }
    }
  };
}

export function init({
  values: { resourceId: resourceIds, eventId: eventIds, ...values }
}: Plugin.ExpectedArguments<typeof options>) {
  configure({
    pathToCSV: Positionals.get('pathToCSV'),
    resourceIds,
    eventIds,
    ...values
  });
  Veracross.configure({
    reason: 'vc resources reserve',
    credentials: {
      scope
    }
  });
}

export async function run() {
  let data: { resource_id: number[]; event_id: number[] }[] = [];
  if (config.pathToCSV) {
    const pathToCSV = path.resolve(Root.path(), config.pathToCSV);
    if (!fs.existsSync(pathToCSV)) {
      throw new Error(`CSV file not found at ${Colors.path(pathToCSV)}`);
    }
    Log.debug(fs.readFileSync(pathToCSV, 'utf8'));
    const csv: {
      resource_id: string;
      event_id: string;
    }[] = parse(fs.readFileSync(pathToCSV, 'utf8'), {
      columns: true
    });
    data.push(
      ...csv.map(({ resource_id, event_id }) => ({
        resource_id: resource_id.split(',').map((id) => parseInt(id)),
        event_id: event_id.split(',').map((id) => parseInt(id))
      }))
    );
  } else if (!config.resourceIds?.length || !config.eventIds?.length) {
    throw new Error('No data provided');
  }

  if (config.resourceIds?.length && config.eventIds?.length) {
    data.unshift({
      resource_id: config.resourceIds,
      event_id: config.eventIds
    });
  }

  for (const reservation of data) {
    const spinner = ora(status(reservation)).start();
    for (const resource_id of reservation.resource_id) {
      for (const event_id of reservation.event_id) {
        spinner.text = status(reservation, resource_id, event_id);
        await Veracross.Data().POST('/resource_reservations/reservations', {
          body: { data: { event_id, resource_id } }
        });
      }
    }
    spinner.succeed(status(reservation));
  }
}

function status(
  {
    resource_id: r,
    event_id: e
  }: { resource_id: number[]; event_id: number[] },
  resource_id?: number,
  event_id?: number
) {
  return `Resource${r.length > 1 ? 's' : ''} ${r
    .map((res) => (res === resource_id ? Colors.value(res) : res))
    .join(', ')} → Event${e.length > 1 ? 's' : ''} ${e
    .map((evt) => (evt === event_id ? Colors.value(evt) : evt))
    .join(', ')}`;
}
