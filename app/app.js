'use strict';

import React from 'react';
import App from './components/app';
import props from './props';

window.React = React;

function render () {
  React.render(<App { ...props } />, window.document.getElementById('main'));
}

render();

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

  props.processes = ps;

  render();
});

window.socket.on('self', ps => {
  window.pid = ps;
});

window.socket.on('total mem', mem => {
  props.memory.total = mem;
  render();
});

window.socket.on('free mem', mem => {
  props.memory.free = mem;
  render();
});

window.socket.on('cpu load', load => {
  props.cpu.load = load;
  render();
});
