import { OpenAPI3 } from 'openapi-typescript';

export type Specification = {
  name: string;
  path: string;
  url: string;
  spec: OpenAPI3;
  fileName: string;
  import: string;
};
