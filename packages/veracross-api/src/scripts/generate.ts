import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { Core } from '@qui-cli/core';
import { register } from '@qui-cli/plugin';
import { constantCase, pascalCase, snakeCase } from 'change-case';
import Handlebars from 'handlebars';
import ora from 'ora';
import { parse } from 'yaml';

const templates: Record<string, HandlebarsTemplateDelegate> = {};
const spinner = ora('Generating API').start();

function writeFile(
  template: string,
  filePath: string,
  args: Record<string, unknown>
) {
  if (!(template in templates)) {
    templates[template] = Handlebars.compile(
      fs.readFileSync(
        path.join(
          import.meta.dirname,
          '../templates',
          `${template}.handlebars`
        ),
        'utf-8'
      )
    );
  }
  if (!(template in templates)) {
    throw new Error(`Missing template ${Colors.value(template)}`);
  }
  fs.writeFileSync(filePath, templates[template](args));
}

function index(apiPath: string) {
  const queue: string[] = [];

  function traverse(dirPath: string) {
    spinner.start(`${Colors.path(dirPath.replace(apiPath, ''), Colors.value)}`);
    const exports = fs
      .readdirSync(dirPath)
      .filter((fileName) => fileName.startsWith('.') === false)
      .map((fileName) => {
        const filePath = path.join(dirPath, fileName);
        if (fs.statSync(filePath).isDirectory()) {
          queue.push(filePath);
          return {
            path: [path.join(fileName, 'index.js')],
            module: pascalCase(fileName)
          };
        }
        return { path: [`${path.basename(fileName, '.ts')}.js`] };
      });
    const indexPath = path.join(dirPath, 'index.ts');
    writeFile('index', indexPath, { exports });
    spinner.succeed(
      `${Colors.path(dirPath.replace(apiPath, path.basename(apiPath)), Colors.value)}${Colors.path('/index.ts')}`
    );
  }

  queue.push(apiPath);
  do {
    const next = queue.shift();
    if (next) {
      traverse(next);
    }
  } while (queue.length);
}

await register({
  name: 'generate',
  options: () => ({
    man: [{ text: 'Generates API structure from YAML files' }]
  }),
  run: async () => {
    for (const api of fs.readdirSync(path.join(process.cwd(), 'spec'))) {
      const spec = parse(
        fs.readFileSync(
          path.join(import.meta.dirname, `../spec/${api}`),
          'utf-8'
        )
      );
      const apiName = path.basename(api, '-API.yaml');
      const apiPath = path.join(import.meta.dirname, '../src', apiName);
      const specFile = `${path.basename(api, '.yaml')}.js`;

      fs.mkdirSync(apiPath, { recursive: true });

      for (const endpoint in spec.paths) {
        spinner.start(`${Colors.url(endpoint)}`);
        const operations = spec.paths[endpoint];
        for (const method in operations) {
          if (method === 'parameters') continue;
          spinner.text = `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}`;
          const operation = operations[method];
          let operationType = method;
          if (apiName === 'Data' || apiName === 'Files') {
            operationType = snakeCase(operation.operationId).replace(
              /^([^_]+)[_].*/,
              '$1'
            );
          }
          const {
            responses: {
              [200]: {
                content: {
                  ['application/json']: {
                    schema: { type: schemaType } = {}
                  } = {}
                } = {}
              } = {}
            }
          } = operation;
          if (operationType === 'get' && schemaType === 'array') {
            operationType = 'list';
          }

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

          const [{ access_token: [scope] = [] } = {}] =
            operation.security || [];
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

          writeFile(operationType, filePath, {
            specFile,
            apiName,
            scope,
            typeName,
            endpoint,
            params,
            operation
          });
          spinner.succeed(
            `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}\n  ${Colors.varName(apiName)}${path
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

      index(apiPath);
      const clientPath = path.join(apiPath, 'client.ts');
      spinner.start(
        Colors.path(clientPath.replace(apiPath, apiName), Colors.value)
      );
      writeFile('client', clientPath, { specFile });
      spinner.succeed();
    }
  }
});
await Core.run();
