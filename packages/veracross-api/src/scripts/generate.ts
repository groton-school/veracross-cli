import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { Core } from '@qui-cli/core';
import { register } from '@qui-cli/plugin';
import { constantCase, pascalCase } from 'change-case';
import Handlebars from 'handlebars';
import ora from 'ora';
import { parse } from 'yaml';

await register({
  name: 'generate',
  options: () => ({
    man: [{ text: 'Generates API structure from YAML files' }]
  }),
  run: async () => {
    const templates: Record<string, HandlebarsTemplateDelegate> = {};
    const spinner = ora('Generating API').start();

    // TODO iterate across all downloaded specs
    const api = 'Data';

    const spec = parse(
      fs.readFileSync(
        path.join(import.meta.dirname, `../spec/${api}-API.yaml`),
        'utf-8'
      )
    );
    const apiPath = path.join(import.meta.dirname, '../src', api);

    function index(dirPath: string) {
      const indexQueue: string[] = [];
      function _index(dirPath: string) {
        spinner.start(
          `${Colors.path(dirPath.replace(apiPath, ''), Colors.value)}`
        );
        const exports = fs
          .readdirSync(dirPath)
          .filter((fileName) => fileName.startsWith('.') === false)
          .map((fileName) => {
            const filePath = path.join(dirPath, fileName);
            if (fs.statSync(filePath).isDirectory()) {
              indexQueue.push(filePath);
              return {
                path: [path.join(fileName, 'index.js')],
                module: pascalCase(fileName)
              };
            }
            return { path: [`${path.basename(fileName, '.ts')}.js`] };
          });
        if (!('index' in templates)) {
          templates['index'] = Handlebars.compile(
            fs.readFileSync(
              path.join(
                import.meta.dirname,
                '../templates',
                `index.handlebars`
              ),
              'utf-8'
            )
          );
        }
        const indexPath = path.join(dirPath, 'index.ts');
        fs.writeFileSync(indexPath, templates['index']({ exports }));
        spinner.succeed(
          `${Colors.path(dirPath.replace(apiPath, path.basename(apiPath)), Colors.value)}${Colors.path('/index.ts')}`
        );
      }

      indexQueue.push(dirPath);
      do {
        const next = indexQueue.shift();
        if (next) {
          _index(next);
        }
      } while (indexQueue.length);
    }

    for (const endpoint in spec.paths) {
      spinner.start(`${Colors.url(endpoint)}`);
      const operations = spec.paths[endpoint];
      for (const method in operations) {
        if (method === 'parameters') continue;
        spinner.text = `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}`;
        const operation = operations[method];
        if (!(method in templates)) {
          const operationType = operation.operationId.replace(
            /^([^_]+)_.*/,
            '$1'
          );
          templates[operationType] = Handlebars.compile(
            fs.readFileSync(
              path.join(
                import.meta.dirname,
                '../templates',
                `${operationType}.handlebars`
              ),
              'utf-8'
            )
          );

          const filePath = path.join(
            apiPath,
            ...endpoint
              .replace(/^\//, '')
              .replace(/\/\{[^}]+\}/g, '')
              .split('/')
              .map((token) => pascalCase(token || '')),
            `${operationType}.ts`
          );
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          const [
            {
              access_token: [scope]
            }
          ] = operation.security;
          if (fs.existsSync(filePath)) {
            throw new Error(`Cannot generate ${operation.operationId}`, {
              cause: `${filePath} already exists`
            });
          }
          const params = {
            path: (endpoint.match(/\{[^}]+\}/g) || []).map((p: string) =>
              p.replace(/\{|\}/g, '')
            )
          };
          const typeName = pascalCase(
            operation.summary.replace(/^.*: (.+)$/, '$1')
          ).replace(/s$/, '');
          fs.writeFileSync(
            filePath,
            templates[operationType]({
              scope,
              typeName,
              endpoint,
              params,
              operation
            })
          );
          spinner.succeed(
            `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}\n  ${Colors.varName('Data')}${path
              .dirname(filePath)
              .replace(apiPath, '')
              .split('/')
              .map((token) => Colors.varName(token))
              .join(
                '.'
              )}.${Colors.command(operationType)}(): Promise<${Colors.value(typeName + (operationType === 'list' ? 'Collection' : ''))}>`
          );
        }
      }
    }

    index(apiPath);
  }
});
await Core.run();
