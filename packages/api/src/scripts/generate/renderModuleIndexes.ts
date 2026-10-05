import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { spinner } from './spinner.js';
import { renderTemplate } from './writeTemplatedFile.js';

export function renderModuleIndexes(apiPath: string) {
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
            module: fileName
          };
        }
        return { path: [`${path.basename(fileName, '.ts')}.js`] };
      });
    const indexPath = path.join(dirPath, 'index.ts');
    renderTemplate('index', indexPath, { exports });
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
