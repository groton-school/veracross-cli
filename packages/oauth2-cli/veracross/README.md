# @oauth2-cli/veracross

Node.js command-line client for Veracross API

[![npm version](https://badge.fury.io/js/@oauth2-cli%2Fveracross.svg)](https://npmjs.com/package/@oauth2-cli/veracross)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

## Install

```sh
npm install @oauth2-cli/veracross @qui-cli/core
```

## Usage

```ts
import { Veracross } from '@oauth2-cli/veracross';
import { Core } from '@qui-cli/core';

// configure any necessary scopes
Veracross.configure({ scope: 'contact_info:read' });

// intialize the @qui-cli environment
await Core.run();

// request your data
console.log(await Veracross.requestJSON('/v3/contact_info/2'));
```

See [@groton/veracross-cli](https://github.com/groton-school/veracross-cli#readme) for more information about the client.

See [@qui-cli](https://github.com/battis/qui-cli#readme) for more information on developing CLI apps quickly in Node.js.
