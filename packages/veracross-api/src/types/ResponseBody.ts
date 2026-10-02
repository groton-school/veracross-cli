import { operations } from '#spec/Data-API.js';

export type ResponseBody<O extends keyof operations> =
  'responses' extends keyof operations[O]
    ? 200 extends keyof operations[O]['responses']
      ? 'content' extends keyof operations[O]['responses'][200]
        ? 'application/json' extends keyof operations[O]['responses'][200]['content']
          ? operations[O]['responses'][200]['content']['application/json']
          : never
        : never
      : never
    : never;

export type ResponseData<O extends keyof operations> =
  ResponseBody<O> extends never
    ? never
    : 'data' extends keyof ResponseBody<O>
      ? ResponseBody<O>['data']
      : never;

export type ResponseValueLists<O extends keyof operations> =
  ResponseBody<O> extends never
    ? never
    : 'value_lists' extends keyof ResponseBody<O>
      ? ResponseBody<O>['value_lists']
      : never;
