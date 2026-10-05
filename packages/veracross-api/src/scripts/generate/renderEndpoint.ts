import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { constantCase, snakeCase } from 'change-case';
import { PathItemObject } from 'openapi-typescript';
import pluralize from 'pluralize';
import { deref } from './deref.js';
import {
  APPLICATION_JSON,
  APPLICATION_X_WWW_FORM_URLENCODED
} from './MimeTypes.js';
import { smartPascalCase } from './smartPascalCase.js';
import { Specification } from './Specification.js';
import { spinner } from './spinner.js';
import { renderTemplate } from './writeTemplatedFile.js';

type Options = {
  api: Specification;
  endpoint: string;
  operations: PathItemObject;
};

export function renderEndpoint({ api, endpoint, operations }: Options) {
  spinner.start(`${Colors.url(endpoint)}`);
  let method: keyof typeof operations;
  for (method in operations) {
    if (method === 'parameters') continue;
    spinner.text = `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}`;
    const operation = operations[method];
    let operationType: string = method;
    if (api.name === 'Data' || api.name === 'Files') {
      operationType = snakeCase(operation.operationId || '').replace(
        /^([^_]+)[_].*/,
        '$1'
      );
    }
    if (
      operationType === 'get' &&
      'responses' in operation &&
      operation.responses &&
      200 in operation.responses &&
      'content' in operation.responses[200] &&
      operation.responses[200].content &&
      APPLICATION_JSON in operation.responses[200].content &&
      operation.responses[200].content[APPLICATION_JSON] &&
      'schema' in operation.responses[200].content[APPLICATION_JSON] &&
      operation.responses[200].content[APPLICATION_JSON].schema &&
      'type' in operation.responses[200].content[APPLICATION_JSON].schema &&
      operation.responses[200].content[APPLICATION_JSON].schema.type === 'array'
    ) {
      operationType = 'list';
    }

    const filePath = path.join(
      api.path,
      ...endpoint
        .replace(/^\//, '')
        .replace(/\/\{[^}]+\}/g, '')
        .split('/')
        .map((token) => smartPascalCase(token || '')),
      `${operationType}.ts`
    );
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let scope: string | undefined = undefined;
    if (
      operation.security &&
      operation.security.length > 0 &&
      'access_token' in operation.security[0] &&
      operation.security[0].access_token &&
      Array.isArray(operation.security[0].access_token) &&
      operation.security[0].access_token.length > 0
    ) {
      scope = operation.security[0].access_token[0];
    }
    if (fs.existsSync(filePath)) {
      throw new Error(
        Colors.error(`Cannot generate ${Colors.value(operation.operationId)}`),
        {
          cause: `${Colors.path(filePath)} already exists`
        }
      );
    }

    const params = {
      path: (endpoint.match(/\{[^}]+\}/g) || []).map((p: string) =>
        p.replace(/\{|\}/g, '')
      )
    };

    const typeName = pluralize.singular(
      smartPascalCase((operation.summary || '').replace(/^.*: (.+)$/, '$1'))
    );

    const requestBody = deref(operation.requestBody, api.spec);

    renderTemplate(operationType, filePath, {
      spec: api.import,
      api: api.name,
      scope,
      typeName,
      endpoint,
      params,
      form: !!(
        requestBody &&
        requestBody.content &&
        APPLICATION_X_WWW_FORM_URLENCODED in requestBody.content
      ),
      operation
    });
    spinner.succeed(
      `${Colors.command(constantCase(method))} ${Colors.url(endpoint)}\n  ${Colors.varName(api.name)}${path
        .dirname(filePath)
        .replace(api.path, '')
        .split('/')
        .map((token) => Colors.varName(token))
        .join(
          '.'
        )}.${Colors.command(operationType)}(): Promise<${Colors.value(typeName + (operationType === 'list' ? 'Collection' : ''))}>`
    );
  }
}
