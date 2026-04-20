import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

Veracross.configure({ credentials: { scope: 'contact_info:read' } });
await Core.run();
Log.info({
  info: await Veracross.client().Data.GET('/contact_info/{id}', {
    params: { path: { id: 2 } }
  })
});
