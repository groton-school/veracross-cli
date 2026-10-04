import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

Veracross.configure({
  reason: 'dev-command',
  credentials: { scope: Veracross.Data.ContactInfo.READ_SCOPE }
});
await Core.run();

Log.info({
  user_info: await Veracross.Authorization.OAuth.Userinfo.get({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${(await Veracross.client().getToken()).access_token}`
    }
  }),
  token_introspection:
    (await Veracross.Authorization.OAuth.Introspect.post({
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: {
        client_id: Veracross.client().credentials.client_id,
        client_secret: Veracross.client().credentials.client_secret,
        token: (await Veracross.client().getToken()).access_token
      }
    })) || 'undefined'
});
