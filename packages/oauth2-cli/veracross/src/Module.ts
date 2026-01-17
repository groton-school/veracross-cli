import { VeracrossPlugin } from './Veracross.js';

export * from './Veracross.js';

const veracross = new VeracrossPlugin();

export const name = veracross.name;
export const configure = veracross.configure.bind(veracross);
export const options = veracross.options.bind(veracross);
export const init = veracross.init.bind(veracross);

export const getToken: typeof veracross.getToken =
  veracross.getToken.bind(veracross);
export const getClient: typeof veracross.getClient =
  veracross.getClient.bind(veracross);

export const request: typeof veracross.request =
  veracross.request.bind(veracross);
export const requestJSON: typeof veracross.request =
  veracross.requestJSON.bind(veracross);
export const fetch: typeof veracross.fetch = veracross.fetch.bind(veracross);
export const fetchJSON: typeof veracross.fetchJSON =
  veracross.fetchJSON.bind(veracross);
