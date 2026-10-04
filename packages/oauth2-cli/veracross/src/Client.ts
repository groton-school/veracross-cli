import * as Veracross from '@groton/veracross-api';
import * as OAuth2 from '@oauth2-cli/qui-cli/extendable/index.js';
import * as Middleware from './Middleware/index.js';

export type Credentials = OAuth2.Credentials & {
  school_route: string;
};

export class Client<C extends Credentials> extends OAuth2.Client<C> {
  public constructor(options: OAuth2.Options<C>) {
    super(options);
    Veracross.Client.register({
      config: options.credentials,
      tokenStore: {
        getAccessToken: async () => (await this.getToken()).access_token
      }
    });
    Veracross.Client.use(new Middleware.RetryWithScope(this));
  }
}
