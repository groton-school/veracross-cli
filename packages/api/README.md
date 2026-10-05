# @oauth2-cli/veracross

TypeScript openapi-fetch client for Veracross API

[![npm version](https://badge.fury.io/js/@groton%2Fveracross-api.svg)](https://npmjs.com/package/@groton/veracross-api)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

This package provides types and endpoint methods built from the Veracross v3 API specifications. It does not provide token management or storage, although proper use of the package requires this. It intentionally abstracts the token management layer for reuse in multiple contexts.

[@oauth2-cli/veracross](https://www.npmjs.com/package/@oauth2-cli/veracross) is a Node.js command line client that uses this package and provides token management and interactive authentication.

## Install

```sh
npm install @groton/veracross-api
```

## Usage

```ts
import * as Veracross from '@groton/veracross-api';

// provide client configuration
Veracross.Client.register({
  config: { school_route: 'example' },
  tokenStore: {
    getAccessToken: async () => {
      // ...return Veracross v3 API OAuth 2.0 access token as string
    }
  }
});

/*
 * Endpoints are collected into modules by path and accept options objects
 * that include:
 *  - required: all path parameters
 *  - required: body (post endoints) or data (create and update endpoints) as
 *    documented
 *  - optional: query, header, and/or cookie objects as documented
 */
await Veracross.Authorizaton.OAuth.Introspect.post({
  header: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: {
    client_id: '...',
    client_secret: '...',
    token: '...'
  }
}) {

}

/*
 * create, read, post, and get endpoints return eponymously-named types that
 * unwrap the data property of the endpoint response
 *
 * contact_info has type Veracross.Data.ContactInfo.ContactInfo
 */
const contact_info = await Veracross.Data.ContactInfo.read({ id: 2 });
console.log(contact_info.id);

/*
 * List endpoints return eponymously-named *Collection types
 *
 * households has type Veracross.Data.Directory.Households.HouseholdCollection
 */
const households = await Veracross.Data.Directory.Households.list({});

/*
 * update endpoints expect *Patch types
 */
const data: Veracross.Data.Academics.Classes.ClassPatch = {
  description: 'Underwater Basket-weaving II'
};
await Veracross.Data.Academics.Classes.update({ id: 123, data });

/*
 * requests that make error responses throw descriptive Errors with the
 * openapi-fetch error from the API as the cause
 */
try {
  await Veracross.Data.Academics.Classses.update({id: -1, data });
} catch (error) {
  console.error(error)
}
```
