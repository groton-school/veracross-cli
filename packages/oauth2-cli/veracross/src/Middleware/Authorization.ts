import { Middleware } from 'openapi-fetch';
import { Client, Credentials } from '../Client.js';

export class Authorization<C extends Credentials = Credentials> {
  public constructor(private client: Client<C>) {}

  public async onRequest({
    request
  }: Parameters<NonNullable<Middleware['onRequest']>>[0]) {
    request.headers.set(
      'Authorization',
      `Bearer ${(await this.client.getToken()).access_token}`
    );
    return request;
  }
}
