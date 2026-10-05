import * as AuthorizationClient from '#Authorization/client.js';
import { ClientConfiguration } from '#Client.js';
import * as DataClient from '#Data/client.js';
import * as FilesClient from '#Files/client.js';
import { Middleware } from 'openapi-fetch';

export {
  OAuthCredentials,
  SchoolConfiguration,
  TokenStore,
  Defaults,
  ClientConfiguration as Configuration
} from '#Client.js';

export function register(config: ClientConfiguration) {
  AuthorizationClient.register(config);
  DataClient.register(config);
  FilesClient.register(config);
}

export function use(middleware: Middleware) {
  AuthorizationClient.client().use(middleware);
  DataClient.client().use(middleware);
  FilesClient.client().use(middleware);
}
