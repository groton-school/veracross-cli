import { operations } from '#spec/Data-API.js';

export type RequestParameters<O extends keyof operations> =
  'parameters' extends keyof operations[O]
    ? operations[O]['parameters']
    : never;

export type RequestPath<O extends keyof operations> =
  RequestParameters<O>['path'];

export type RequestQuery<O extends keyof operations> =
  RequestParameters<O>['query'];

export type RequestHeader<O extends keyof operations> =
  RequestParameters<O>['header'];

export type RequestCookie<O extends keyof operations> =
  RequestParameters<O>['cookie'];
