import { operations } from '@/spec/Data-API.js';
import { RequestData } from './RequestBody.js';
import {
  RequestCookie,
  RequestHeader,
  RequestParameters,
  RequestPath,
  RequestQuery
} from './RequestParameters.js';

type ReqParamsWithoutPathAndUndefined<O extends keyof operations> = Omit<
  RequestParameters<O>,
  | 'path'
  | (RequestQuery<O> extends undefined ? 'query' : '')
  | (RequestHeader<O> extends undefined ? 'header' : '')
  | (RequestCookie<O> extends undefined ? 'cookie' : '')
>;

export type EndpointOptions<O extends keyof operations> = {
  [K in keyof RequestPath<O>]: RequestPath<O>[K];
} & {
  [
    K in keyof ReqParamsWithoutPathAndUndefined<O>
  ]: ReqParamsWithoutPathAndUndefined<O>[K];
} & (RequestData<O> extends never ? object : { data: RequestData<O> });
