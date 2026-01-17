import * as OAuth2 from '@oauth2-cli/qui-cli/dist/OAuth2.js';
import { Colors } from '@qui-cli/colors';
import { Env } from '@qui-cli/env-1password';
import * as Plugin from '@qui-cli/plugin';
import path from 'node:path';
import { Client } from './Client.js';

export {
  EnvironmentStorage,
  FileStorage,
  TokenStorage
} from '@oauth2-cli/qui-cli/dist/OAuth2.js';
export * from './Client.js';

export type Configuration = OAuth2.Configuration & {
  schoolRoute: string;
};

export type ConfigurationProposal = OAuth2.ConfigurationProposal & {
  schoolRoute?: string;
};

export class VeracrossPlugin extends OAuth2.OAuth2Plugin<Client> {
  private schoolRoute: string | undefined = undefined;

  public constructor(name = '@oauth2-cli/veracross') {
    super(name);
    this.configure({
      man: {
        heading: 'Veracross API options'
      },
      opt: {
        clientId: 'vcClientId',
        clientSecret: 'vcClientSecret',
        scope: 'vcScope',
        redirectUri: 'vcRedirectUri',
        tokenPath: 'vcTokenPath',
        accessToken: 'vcAccessToken'
      },
      url: {
        clientId:
          'https://community.veracross.com/s/article/Adding-Internal-Integrations-in-Veracross-API'
      },
      env: {
        clientId: 'VERACROSS_CLIENT_ID',
        clientSecret: 'VERACROSS_CLIENT_SECRET',
        scope: 'VERACROSS_SCOPE',
        redirectUri: 'VERACROSS_REDIRECT_URI',
        tokenPath: 'VERACROSS_TOKEN_PATH',
        accessToken: 'VERACROSS_ACCESS_TOKEN'
      },
      suppress: {
        tokenPath: true,
        authorizationEndpoint: true,
        tokenEndpoint: true
      }
    });
  }

  public configure({ schoolRoute, ...proposal }: ConfigurationProposal = {}) {
    if (schoolRoute) {
      this.schoolRoute = schoolRoute;
    }
    if (this.schoolRoute) {
      proposal.authorizationEndpoint = path.join(
        'https://accounts.veracross.com',
        this.schoolRoute,
        'oauth/authorize'
      );
      proposal.tokenEndpoint = path.join(
        'https://accounts.veracross.com',
        this.schoolRoute,
        'oauth/token'
      );
    }
    super.configure(proposal);
  }

  public options() {
    const options = super.options();
    options.opt = {
      vcSchoolRoute: {
        description:
          `The unique school route for your Veracross instance. Defaults to ` +
          `environment variable ${Colors.varName('VERACROSS_SCHOOL_ROUTE')}, ` +
          `if present. See ` +
          Colors.url(
            'https://api-docs.veracross.com/docs/docs/cd9d140be5811-using-the-data-api#base-url'
          ) +
          ` for more information.`,
        hint: Colors.quotedValue(`"api-example"`),
        default: this.schoolRoute
      },
      ...options.opt
    };
    return options;
  }

  public async init(args: Plugin.ExpectedArguments<typeof this.options>) {
    await super.init(args);
    const {
      values: {
        vcSchoolRoute: schoolRoute = await Env.get({
          key: 'VERACROSS_SCHOOL_ROUTE'
        })
      }
    } = args;
    this.configure({ schoolRoute });
  }

  protected instantiateClient(credentials: OAuth2.Credentials): Client {
    if (!this.schoolRoute) {
      throw new Error('School route must be defined.');
    }
    return new Client({
      school_route: this.schoolRoute,
      ...credentials
    });
  }
}
