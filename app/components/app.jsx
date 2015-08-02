'use strict';

import React from 'react';
import ProcessRow from './process-row';
import Memory from './memory';

class App extends React.Component {

  constructor (props) {
    super(props);

    this.state    =   {
      processes   :   props.processes || [],
      filters     :   {
        cmd       :   null
      }
    };
  }

  componentWillReceiveProps (nextProps) {
    if ( nextProps && ( 'processes' in nextProps ) ) {
      this.state.processes = nextProps.processes;
    }
  }

  filterByCmd (e) {
    let { processes, filters } = this.state;

    filters.cmd = this.refs.cmdFilter.getDOMNode().value;

    this.setState({ filters : filters });
  }

  applyFilters () {
    let { processes, filters } = this.state;

    if ( filters.cmd ) {
      processes = processes.filter(ps => {
        let regex = new RegExp(filters.cmd);
        return regex.test(ps.cmd);
      });
    }

    return processes;
  }

  render () {

    let processes = this.applyFilters();

    return (
      <html>
        <meta charSet="utf-8" />
        <title>ps|js</title>
        <link rel="stylesheet" type="text/css" href="/assets/css/index.css" />
        <link rel="stylesheet" type="text/css" href="/assets/bower_components/font-awesome/css/font-awesome.min.css" />
        <section role="main">
          <header>
            <h1>
              <small>{ processes.length }</small>
              <span> Processes</span>
            </h1>

            { <Memory /> }

            <form>
              <input
                ref             =   "cmdFilter"
                type            =   "text"
                placeholder     =   "Search command"
                onKeyUp         =   { this.filterByCmd.bind(this) }
                />
              <button><i className="fa fa-search"></i></button>
            </form>
          </header>

          <section>
            <ProcessRow pid="PID" cmd="Command" mem="Memory"  />
            {
              processes
                .filter( ps => ps.pid === window.pid )
                .map( ps => <ProcessRow key={ ps.pid } {...ps} /> )
            }
            {
              processes
                .filter( ps => ps.pid !== window.pid )
                .filter( ps => ( ps.state === 'R' || ps.state === 'S' ) )
                .map( ps => <ProcessRow key={ ps.pid } {...ps} /> )
            }
          </section>

        </section>
        <script src="/socket.io/socket.io.js"></script>
        <script src="/bundle.js"></script>
      </html>
    );
  }

}

export default App;

if ( typeof window !== 'undefined' ) {
  window.React = React;

  React.render(<App />, window.document);

  window.socket = io.connect();

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

    React.render(<App processes={ ps } />, window.document);
  });

  window.socket.on('self', ps => {
    window.pid = ps;
  });

  window.socket.on('total mem', mem => {
    window.totalMem = mem;
  });
}
