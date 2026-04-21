import { Token } from '@oauth2-cli/qui-cli/extendable/index.js';
import { Colors } from '@qui-cli/colors';
import { Middleware } from 'openapi-fetch';
import ora from 'ora';
import { Client, Credentials } from '../Client.js';

export class RetryWithScope<C extends Credentials = Credentials> {
  public constructor(private client: Client<C>) {}

  public async onResponse({
    request,
    response
  }: Parameters<NonNullable<Middleware['onResponse']>>[0]) {
    if (response.status === 401) {
      const { error } = JSON.parse(await response.text()) as {
        error: string;
      };
      const [, scope] =
        error.match(
          /^The provided access token is missing a required scope: (.+)$/
        ) || [];
      if (scope) {
        if (
          Token.Scope.toArray(this.client.credentials.scope || []).includes(
            scope
          )
        ) {
          try {
            await this.client.authorize();
            request.headers.set(
              'Authorization',
              `Bearer ${(await this.client.getToken()).access_token}`
            );
            return await fetch(request);
          } catch (error) {
            throw new Error(
              `Could not authorize ${this.client.name} with scope ${Colors.value(scope)}`,
              { cause: error }
            );
          }
        } else {
          throw new Error('Scope credentials mismatch', {
            cause: {
              endpoint: request.url,
              'scope required by endpoint': scope,
              'scope defined in credentials': this.client.credentials.scope
            }
          });
        }
      } else {
        throw new Error('Authorization error', {
          cause: {
            response: {
              ok: response.ok,
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              body: await response.text()
            }
          }
        });
      }
    }
    return response;
  }
}
