import { Veracross } from '@oauth2-cli/veracross';
import { build } from '@qui-cli/structured';
import path from 'node:path';

Veracross.configure({ reason: 'vc' });

await build({
  fileName: import.meta.filename,
  commandDirPath: path.join(import.meta.dirname, 'Commands')
});
