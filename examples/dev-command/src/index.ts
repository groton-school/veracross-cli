import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';
import { Log } from '@qui-cli/log';

Veracross.configure({ scope: 'contact_info:read' });
await Core.run();
Log.info(await Veracross.requestJSON('v3/contact_info/2'));
