export type RequestParameters<
  M,
  O extends keyof M
> = 'parameters' extends keyof M[O] ? M[O]['parameters'] : never;

export type RequestPath<
  M,
  O extends keyof M
> = 'path' extends keyof RequestParameters<M, O>
  ? RequestParameters<M, O>['path']
  : never;

export type RequestQuery<
  M,
  O extends keyof M
> = 'query' extends keyof RequestParameters<M, O>
  ? RequestParameters<M, O>['query']
  : never;

export type RequestHeader<
  M,
  O extends keyof M
> = 'header' extends keyof RequestParameters<M, O>
  ? Omit<RequestParameters<M, O>['header'], 'Content-Type' | 'Authorization'>
  : never;

export type RequestCookie<
  M,
  O extends keyof M
> = 'cookie' extends keyof RequestParameters<M, O>
  ? RequestParameters<M, O>['cookie']
  : never;
