/* eslint-disable @typescript-eslint/no-empty-object-type */

import { RequestBody, RequestData } from './RequestBody.js';
import {
  RequestCookie,
  RequestHeader,
  RequestParameters,
  RequestPath,
  RequestQuery
} from './RequestParameters.js';

type ReqParamsWithoutPathAndUndefined<M, O extends keyof M> = {} & Omit<
  RequestParameters<M, O>,
  | 'path'
  | (RequestQuery<M, O> extends undefined ? 'query' : '')
  | (RequestHeader<M, O> extends undefined ? 'header' : '')
  | (RequestCookie<M, O> extends undefined ? 'cookie' : '')
>;

export type EndpointOptions<
  M,
  O extends keyof M,
  Method extends 'GET' | undefined = undefined
> = {
  [K in keyof RequestPath<M, O>]: RequestPath<M, O>[K];
} & {
  [
    K in keyof ReqParamsWithoutPathAndUndefined<M, O>
  ]: ReqParamsWithoutPathAndUndefined<M, O>[K];
} & (RequestData<M, O> extends never
    ? RequestBody<M, O> extends never
      ? Method extends 'GET'
        ? {}
        : { body?: undefined }
      : { body: RequestBody<M, O> }
    : { data: RequestData<M, O> });
