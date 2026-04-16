import * as API from './Data-API.js';
import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './VeracrossPlugin.js';
export { API };

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

export const Data = plugin.client.Data;
