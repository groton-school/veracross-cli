import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

Veracross.configure({
  reason: 'dev-command',
  credentials: { scope: 'contact_info:read' }
});
await Core.run();
Log.info(
  (
    await Veracross.Data().GET('/contact_info/{id}', {
      params: { path: { id: 2 } }
    })
  ).response
);
