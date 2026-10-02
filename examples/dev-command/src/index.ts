import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

Veracross.configure({
  reason: 'dev-command',
  credentials: { scope: Veracross.v3.ContactInfo.READ_SCOPE }
});
await Core.run();
Log.info(await Veracross.v3.ContactInfo.read({ id: 2 }));
