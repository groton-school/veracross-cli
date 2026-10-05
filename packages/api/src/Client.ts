import * as OpenAPI from 'openapi-fetch';

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

export interface ClientConfiguration {
  config: SchoolConfiguration;
  tokenStore: TokenStore;
  defaults?: Defaults;
}

type Configuration = ClientConfiguration & { baseUrl: string };

export class Client<P extends object> {
  private _client: OpenAPI.Client<P>;
  private _defaults: Defaults = { DEFAULT_PAGE_SIZE: 100 };

  public constructor({ config, tokenStore, defaults, baseUrl }: Configuration) {
    this._client = OpenAPI.default<P>({
      baseUrl: baseUrl.replace('{school_route}', config.school_route)
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
