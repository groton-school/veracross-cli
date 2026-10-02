import { WritableKeys } from '@battis/typescript-tricks';
import { operations } from '#spec/Data-API.js';

export type RequestBody<O extends keyof operations> =
  'requestBody' extends keyof operations[O]
    ? 'content' extends keyof NonNullable<operations[O]['requestBody']>
      ? 'application/json' extends keyof NonNullable<
          operations[O]['requestBody']
        >['content']
        ? NonNullable<
            operations[O]['requestBody']
          >['content']['application/json']
        : never
      : never
    : never;

type WritableRequestData<O extends keyof operations> = Pick<
  RequestBody<O>['data'],
  WritableKeys<RequestBody<O>['data']>
>;

export type RequestData<O extends keyof operations> =
  RequestBody<O> extends never
    ? never
    : 'data' extends keyof RequestBody<O>
      ? {
          [K in keyof WritableRequestData<O>]: WritableRequestData<O>[K];
        }
      : never;
