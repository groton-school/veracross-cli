import * as OpenAPI from 'openapi-fetch';
import { paths } from './spec/Data-API.js';

export interface Defaults {
  DEFAULT_PAGE_SIZE: number;
}

export interface SchoolConfiguration {
  school_route: string;
}

export interface OAuthCredentials extends SchoolConfiguration {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string;
}

export interface TokenStore {
  getAccessToken(): Promise<string>;
}

type Options = {
  config: SchoolConfiguration;
  tokenStore: TokenStore;
  defaults?: Defaults;
};

export class Client<P extends paths = paths> {
  private _client: OpenAPI.Client<P>;
  private _defaults: Defaults = { DEFAULT_PAGE_SIZE: 100 };

  public constructor({ config, tokenStore, defaults }: Options) {
    this._client = OpenAPI.default<paths>({
      baseUrl: `https://api.veracross.com/${config.school_route}/v3`
    });
    this._client.use({
      onRequest: async ({ request }) => {
        request.headers.set(
          'Authorization',
          `Bearer ${await tokenStore.getAccessToken()}`
        );
        return request;
      }
    });
    this._defaults = { ...this._defaults, ...defaults };
  }

  public client(): OpenAPI.Client<P> {
    return this._client;
  }
  public defaults(): Defaults {
    return this._defaults;
  }
}

let _client: Client | undefined = undefined;

export function register(client: Client) {
  _client = client;
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
