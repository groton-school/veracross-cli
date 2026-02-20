import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './VeracrossPlugin.js';

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

export const request: typeof plugin.request = plugin.request.bind(plugin);
export const requestJSON: typeof plugin.requestJSON =
  plugin.requestJSON.bind(plugin);
export const fetch: typeof plugin.fetch = plugin.fetch.bind(plugin);
export const fetchJSON: typeof plugin.fetchJSON = plugin.fetchJSON.bind(plugin);
