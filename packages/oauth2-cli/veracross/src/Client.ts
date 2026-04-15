import * as OAuth2 from '@oauth2-cli/qui-cli/extendable/index.js';
import { Log } from '@qui-cli/log';
import createClient, { Middleware } from 'openapi-fetch';
import { paths } from './Data-API.js';

export type Credentials = OAuth2.Credentials & {
  school_route: string;
};

export class Client<C extends Credentials> extends OAuth2.Client<C> {
  public readonly Data;

  public constructor(options: OAuth2.Options<C>) {
    super(options);
    this.Data = createClient<paths>({
      baseUrl: `https://api.veracross.com/${this.credentials.school_route}/v3`
    });
    this.Data.use(this.middleware());
  }

  protected middleware(): Middleware {
    const getToken = this.getToken;
    return {
      async onRequest({ request }) {
        request.headers.set(
          'Authorization',
          `Bearer ${(await getToken()).access_token}`
        );
        return request;
      }
    };
  }
}
