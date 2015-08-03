'use strict';

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import colors from 'colors';

let file = path.resolve(__dirname, '../../assets/css/index.js');

fs.watch(file, (event, filename) => {
  exec('npm run css', (error, stdout, stderr) => {
    if ( error ) {
      error.stack.split(/\n/).forEach(line => console.log(line.red));
    }
    if ( stdout ) {
      console.log(stdout.blue);
    }
    if ( stderr ) {
      console.log(stderr.yellow);
    }
  });
});
