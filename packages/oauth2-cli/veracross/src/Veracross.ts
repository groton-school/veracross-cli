/* eslint-disable @typescript-eslint/no-namespace */

import { Authorization, Data, Files } from '@groton/veracross-api';
import * as Spec from '@groton/veracross-api/dist/spec/Data-API.js';
import { VeracrossPlugin } from './VeracrossPlugin.js';

export * from './VeracrossPlugin.js';

export const plugin = new VeracrossPlugin();

export const configure = plugin.configure.bind(plugin);

export const client = () => plugin.client;

// TODO when deprecation removed, simplify import/export to just an export
export { Authorization, Data, Files };

/** @deprecated use named types from {@link Authorization}, {@link Data}, {@link Files} */
export namespace Types {
  /** @deprecated use named types from {@link Authorization}, {@link Data}, {@link Files} */
  export namespace spec {
    /** @deprecated use named types from {@link Authorization}, {@link Data}, {@link Files} */
    export namespace DataAPI {
      /** @deprecated use named types from {@link Authorization}, {@link Data}, {@link Files} */
      export type paths = Spec.paths;
      /** @deprecated use named types from {@link Authorization}, {@link Data}, {@link Files} */
      export type operations = Spec.operations;
    }
  }
}
