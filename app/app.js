'use strict';

import React from 'react';
import App from './components/app';

window.React = React;

React.render(<App />, window.document.getElementById('main'));

window.socket = io.connect('http://localhost:2007');

window.socket.on('ps', ps => {

  ps.sort((a, b) => {
    if ( +a.pid > +b.pid ) {
      return 1;
    }
    if ( +a.pid < +b.pid ) {
      return -1;
    }
    return 0;
  });

  React.render(<App processes={ ps } />, window.document.getElementById('main'));
});

window.socket.on('self', ps => {
  window.pid = ps;
});

window.socket.on('total mem', mem => {
  window.totalMem = mem;
});
