import { WritableKeys } from '@battis/typescript-tricks';

export type RequestBody<M, O extends keyof M> = 'requestBody' extends keyof M[O]
  ? 'content' extends keyof NonNullable<M[O]['requestBody']>
    ? 'application/json' extends keyof NonNullable<
        M[O]['requestBody']
      >['content']
      ? NonNullable<M[O]['requestBody']>['content']['application/json']
      : 'application/x-www-form-urlencoded' extends keyof NonNullable<
            M[O]['requestBody']
          >['content']
        ? NonNullable<
            M[O]['requestBody']
          >['content']['application/x-www-form-urlencoded']
        : never
    : never
  : never;

type WritableRequestData<
  M,
  O extends keyof M
> = 'data' extends keyof RequestBody<M, O>
  ? Pick<RequestBody<M, O>['data'], WritableKeys<RequestBody<M, O>['data']>>
  : never;

export type RequestData<M, O extends keyof M> =
  RequestBody<M, O> extends never
    ? never
    : 'data' extends keyof RequestBody<M, O>
      ? {
          [K in keyof WritableRequestData<M, O>]: WritableRequestData<M, O>[K];
        }
      : never;
