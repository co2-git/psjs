'use strict';

import express                from 'express';
import http                   from 'http';
import { EventEmitter }       from 'events';
import API                    from './api';
import React                  from 'react';
import App                    from '../components/app';

class Server extends EventEmitter {

  constructor () {
    super();

    this.app = express();
    this.port = process.env.PORT || 2007;

    this.Factory = React.createFactory(App);

    this.router();
  }

  router () {
    this.homePage();
    this.assets();
  }

  homePage () {
    this.app.get('/', (req, res, next) => {
      let app = this.Factory({ path : req.path });
      res.send('<!doctype html>\n' + React.renderToString(app));
    });
  }

  assets () {
    this.app.use('/bundle.js', express.static('dist/js/bundle.js'));
    this.app.use('/assets', express.static('assets'));
  }

  start () {
    this.server = http.createServer(this.app);

    this.server.listen(this.port, () => {
      this.emit('message', 'You are listening to port ' + this.port);

      new API(this)
        .on('error', error => this.emit('error', error))
        .on('message', message => this.emit('message', message));
    });
  }

}

export default Server;
