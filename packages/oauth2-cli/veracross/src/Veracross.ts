import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './spec/index.js';
export * from './VeracrossPlugin.js';

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

export const Data = () => plugin.client.Data;
export const Files = () => plugin.client.Files;
