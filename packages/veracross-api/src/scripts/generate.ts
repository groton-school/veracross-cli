import fs from 'node:fs';
import path from 'node:path';
import { pascalCase } from 'change-case';
import Handlebars from 'handlebars';
import { parse } from 'yaml';

const templates: Record<string, HandlebarsTemplateDelegate> = {};

function index(dirPath: string) {
  const indexQueue: string[] = [];
  function _index(dirPath: string) {
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
          path.join(import.meta.dirname, '../templates', `index.handlebars`),
          'utf-8'
        )
      );
    }
    fs.writeFileSync(
      path.join(dirPath, 'index.ts'),
      templates['index']({ exports })
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

// TODO iterate across all downloaded specs
const api = 'Data';

const spec = parse(
  fs.readFileSync(
    path.join(import.meta.dirname, `../spec/${api}-API.yaml`),
    'utf-8'
  )
);
const apiPath = path.join(import.meta.dirname, '../src', api);
for (const endpoint in spec.paths) {
  const operations = spec.paths[endpoint];
  for (const method in operations) {
    if (method === 'parameters') continue;
    const operation = operations[method];
    if (!(method in templates)) {
      const operationType = operation.operationId.replace(/^([^_]+)_.*/, '$1');
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
      fs.writeFileSync(
        filePath,
        templates[operationType]({
          scope,
          typeName: pascalCase(
            operation.summary.replace(/^.*: (.+)$/, '$1')
          ).replace(/s$/, ''),
          endpoint,
          params,
          operation
        })
      );
    }
  }
}

index(apiPath);
