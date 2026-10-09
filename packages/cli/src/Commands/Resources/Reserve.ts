import fs from 'node:fs';
import path from 'node:path';
import { PathString } from '@battis/descriptive-types';
import { Veracross } from '@oauth2-cli/veracross';
import { Colors } from '@qui-cli/colors';
import { Positionals } from '@qui-cli/core';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import { parse } from 'csv/sync';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  pathToCSV?: PathString;
  resourceIds?: number[];
  eventIds?: number[];
};

type Reservation = { resource_id: number[]; event_id: number[] };
type UnparsedReservation = Record<keyof Reservation, string>;

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

const scope = [Veracross.Data.ResourceReservations.Reservations.CREATE_SCOPE];

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

export function options() {
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
  const reservations: Reservation[] = [];
  if (config.pathToCSV) {
    const pathToCSV = path.resolve(Root.path(), config.pathToCSV);
    if (!fs.existsSync(pathToCSV)) {
      throw new Error(`CSV file not found at ${Colors.path(pathToCSV)}`);
    }
    const unparsed = parse<UnparsedReservation>(
      fs.readFileSync(pathToCSV, 'utf8'),
      {
        columns: true,
        bom: true
      }
    );
    reservations.push(...unparsed.map(parseReservation));
  } else if (!config.resourceIds?.length || !config.eventIds?.length) {
    throw new Error('No data provided');
  }

  if (config.resourceIds?.length && config.eventIds?.length) {
    reservations.unshift({
      resource_id: config.resourceIds,
      event_id: config.eventIds
    });
  }

  for (const reservation of reservations) {
    const spinner = ora(status(reservation)).start();
    for (const resource_id of reservation.resource_id) {
      for (const event_id of reservation.event_id) {
        spinner.text = status(reservation, resource_id, event_id);
        await Veracross.Data.ResourceReservations.Reservations.create({
          data: { event_id, resource_id }
        });
      }
    }
    spinner.succeed(status(reservation));
  }
}

function parseReservation(reservation: UnparsedReservation) {
  const { resource_id, event_id } = reservation;
  return {
    resource_id: resource_id.split(',').map(parseInt),
    event_id: event_id.split(',').map(parseInt)
  };
}

function status(
  reservation: Reservation,
  resource_id?: number,
  event_id?: number
) {
  return `Resource${reservation.resource_id.length > 1 ? 's' : ''} ${reservation.resource_id
    .map((r) => (r === resource_id ? Colors.value(r) : r))
    .join(
      ', '
    )} → Event${reservation.event_id.length > 1 ? 's' : ''} ${reservation.event_id
    .map((e) => (e === event_id ? Colors.value(e) : e))
    .join(', ')}`;
}
