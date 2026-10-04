/* eslint-disable @typescript-eslint/no-namespace */

import * as Spec from '@groton/veracross-api/dist/spec/Data-API.js';
import { VeracrossPlugin } from './VeracrossPlugin.js';

export { Authorization, Data, Files } from '@groton/veracross-api';

export * from './VeracrossPlugin.js';

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

/** @deprecated use named types from v3 root */
export namespace Types {
  /** @deprecated use named types from v3 root */
  export namespace spec {
    /** @deprecated use named types from v3 root */
    export namespace DataAPI {
      /** @deprecated use named types from v3 root */
      export type paths = Spec.paths;
      /** @deprecated use named types from v3 root */
      export type operations = Spec.operations;
    }
  }
}
