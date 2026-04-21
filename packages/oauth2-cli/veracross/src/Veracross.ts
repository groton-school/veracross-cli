import * as DataAPI from './Data-API.js';
import * as FilesAPI from './Files-API.js';
import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './VeracrossPlugin.js';
export { DataAPI, FilesAPI };

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

export const Data = () => plugin.client.Data;
export const Files = () => plugin.client.Files;
