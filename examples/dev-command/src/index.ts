import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

await Core.run();
Veracross.configure({ scope: 'person_accounts:read' });
Log.info(await Veracross.request('v3/person_accounts/2'));
