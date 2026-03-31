import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './VeracrossPlugin.js';

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

export const requestRaw: typeof plugin.requestRaw =
  plugin.requestRaw.bind(plugin);
export const request: typeof plugin.request = plugin.request.bind(plugin);
export const fetchRaw: typeof plugin.fetchRaw = plugin.fetchRaw.bind(plugin);
export const fetch: typeof plugin.fetch = plugin.fetch.bind(plugin);
