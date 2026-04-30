import * as OAuth2 from '@oauth2-cli/qui-cli/extendable/index.js';
import createClient from 'openapi-fetch';
import * as Middleware from './Middleware/index.js';
import * as spec from './spec/index.js';

export type Credentials = OAuth2.Credentials & {
  school_route: string;
};

export class Client<C extends Credentials> extends OAuth2.Client<C> {
  public readonly Data;
  public readonly Files;

  public constructor(options: OAuth2.Options<C>) {
    super(options);
    this.Data = createClient<spec.DataAPI.paths>({
      baseUrl: `https://api.veracross.com/${this.credentials.school_route}/v3`
    });
    this.Data.use(new Middleware.Authorization(this));
    this.Data.use(new Middleware.RetryWithScope(this));

    this.Files = createClient<spec.FilesAPI.paths>({
      baseUrl: `https://api.veracross.com/${this.credentials.school_route}/v3`
    });
    this.Files.use(new Middleware.Authorization(this));
    this.Files.use(new Middleware.RetryWithScope(this));
  }
}
