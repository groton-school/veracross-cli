import { register, Registrar } from '@qui-cli/plugin';
import { plugin } from './Veracross.js';

export * as Veracross from './Veracross.js';

await register(plugin);
