import path from 'node:path';
import { build } from '@qui-cli/structured';

await build({
  fileName: import.meta.filename,
  commandDirPath: path.join(import.meta.dirname, 'Commands')
});
