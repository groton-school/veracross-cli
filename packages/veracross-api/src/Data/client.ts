import { Client, ClientConfiguration } from '#Client.js';
import type { paths } from '#spec/Data-API.js';

let _client: Client<paths> | undefined = undefined;

export function register(config: ClientConfiguration) {
  _client = new Client<paths>(config);
}

export function client() {
  if (!_client) {
    throw new Error('Client not initialied');
  }
  return _client.client();
}

export function defaults() {
  if (!_client) {
    throw new Error('Client not initialized');
  }
  return _client.defaults();
}
