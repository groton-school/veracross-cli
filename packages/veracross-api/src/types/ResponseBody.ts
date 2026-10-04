export type ResponseBody<M, O extends keyof M> = 'responses' extends keyof M[O]
  ? 200 extends keyof M[O]['responses']
    ? 'content' extends keyof M[O]['responses'][200]
      ? 'application/json' extends keyof M[O]['responses'][200]['content']
        ? M[O]['responses'][200]['content']['application/json']
        : never
      : never
    : never
  : never;

export type ResponseData<M, O extends keyof M> =
  ResponseBody<M, O> extends never
    ? never
    : 'data' extends keyof ResponseBody<M, O>
      ? ResponseBody<M, O>['data']
      : never;

export type ResponseValueLists<M, O extends keyof M> =
  ResponseBody<M, O> extends never
    ? never
    : 'value_lists' extends keyof ResponseBody<M, O>
      ? ResponseBody<M, O>['value_lists']
      : never;
