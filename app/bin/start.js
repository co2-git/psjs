#!/usr/bin/env node

'use strict';

import Server from '../lib/server';

process.title = 'psjs';

function onError (error) {
  console.log(error.stack.split(/\n/))
}

new Server()
  .on('error', onError)
  .on('message', console.log.bind(console, 'message'))
  .start();
