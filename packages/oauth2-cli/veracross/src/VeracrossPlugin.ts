import * as OAuth2 from '@oauth2-cli/qui-cli/extendable/index.js';
import { Colors } from '@qui-cli/colors';
import { Env } from '@qui-cli/env';
import path from 'node:path';

export type Credentials = OAuth2.Credentials & {
  school_route: string;
};

export class VeracrossPlugin extends OAuth2.OAuth2Plugin<Credentials> {
  public constructor(name = 'Veracross API') {
    super(name);
    this.configure({
      man: {
        heading: 'Veracross API options',
        text: [
          `The unique ${Colors.keyword('school_route')} for your Veracross ` +
            `instance is set from the environment variable ` +
            `${Colors.varName('VERACROSS_SCHOOL_ROUTE')}, if present. See ` +
            Colors.url(
              'https://api-docs.veracross.com/docs/docs/cd9d140be5811-using-the-data-api#base-url'
            ) +
            ` for more information. (e.g. ${Colors.quotedValue(`"api-example"`)})`,
          `Once authorized, the app will store the Veracross refresh token for ` +
            `reuse in the local environment as ` +
            `${Colors.varName('VERACROSS_REFRESH_TOKEN')}.`
        ]
      },
      url: {
        client_id:
          'https://community.veracross.com/s/article/Adding-Internal-Integrations-in-Veracross-API'
      },
      env: {
        client_id: 'VERACROSS_CLIENT_ID',
        client_secret: 'VERACROSS_CLIENT_SECRET',
        redirect_uri: 'VERACROSS_REDIRECT_URI',
        scope: 'VERACROSS_SCOPE'
      },
      suppress: {
        issuer: true,
        base_url: true,
        authorization_endpoint: true,
        token_endpoint: true
      },
      storage: new OAuth2.Token.EnvironmentStorage('VERACROSS_REFRESH_TOKEN')
    });
  }

  public async init(
    ...args: Parameters<OAuth2.OAuth2Plugin<Credentials>['init']>
  ) {
    const school_route = await Env.get({ key: 'VERACROSS_SCHOOL_ROUTE' });
    if (school_route) {
      this.configure({
        credentials: {
          school_route,
          authorization_endpoint: path.join(
            'https://accounts.veracross.com',
            school_route,
            'oauth/authorize'
          ),
          token_endpoint: path.join(
            'https://accounts.veracross.com',
            school_route,
            'oauth/token'
          )
        },
        base_url: path.join('https://api.veracross.com', school_route)
      });
    }
    await super.init(...args);
  }
}
