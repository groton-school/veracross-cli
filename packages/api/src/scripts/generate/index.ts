import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { Core } from '@qui-cli/core';
import * as Plugin from '@qui-cli/plugin';
import { bundle, createConfig } from '@redocly/openapi-core';
import { OpenAPI3 } from 'openapi-typescript';
import { renderEndpoint } from './renderEndpoint.js';
import { renderModuleIndexes } from './renderModuleIndexes.js';
import { Specification } from './Specification.js';
import { spinner } from './spinner.js';
import { renderTemplate } from './writeTemplatedFile.js';

type Configuration = Plugin.Configuration & {
  debug?: boolean;
};

const config: Configuration = { debug: false };

function configure(proposal: Partial<Configuration> = {}) {
  for (const key in proposal) {
    if (proposal[key] !== undefined) {
      config[key] = proposal[key];
    }
  }
}

function options() {
  return {
    man: [
      { text: 'Generates API structure from OpenAPI 3 specification files' }
    ],
    flag: {
      debug: {
        description: 'Include debugging output',
        default: config.debug
      }
    }
  };
}

await Plugin.register({
  name: 'generate',
  options,
  configure,
  init: ({ values }: Plugin.ExpectedArguments<typeof options>) => {
    configure(values);
  },
  run: async () => {
    for (const fileName of fs.readdirSync(path.join(process.cwd(), 'spec'))) {
      const name = path.basename(fileName, '-API.yaml');
      const {
        bundle: { parsed }
      } = await bundle({
        ref: path.join(import.meta.dirname, `../../spec/${fileName}`),
        config: await createConfig({})
      });
      const spec = parsed as OpenAPI3;
      const { servers: [{ url }] = [] } = spec;
      const api: Specification = {
        name,
        path: path.join(import.meta.dirname, '../../src', name),
        fileName,
        import: `${path.basename(fileName, '.yaml')}.js`,
        spec,
        url
      };
      fs.mkdirSync(path.join(import.meta.dirname, '../../var'), {
        recursive: true
      });

      if (config.debug) {
        fs.writeFileSync(
          path.join(import.meta.dirname, `../../var/${api.name}.openapi3.json`),
          JSON.stringify(spec, null, 2)
        );
      }

      fs.mkdirSync(api.path, { recursive: true });

      for (const endpoint in api.spec.paths) {
        renderEndpoint({
          api,
          endpoint,
          operations: api.spec.paths[endpoint]
        });
      }

      renderModuleIndexes(api.path);
      const clientPath = path.join(api.path, 'client.ts');
      spinner.start(
        Colors.path(clientPath.replace(api.path, api.name), Colors.value)
      );
      renderTemplate('client', clientPath, { spec: api.import, url: api.url });
      spinner.succeed();
    }
  }
});
await Core.run();
