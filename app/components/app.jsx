'use strict';

import React          from 'react';
import ProcessRow     from './process-row';
import TopBar         from './top-bar';

class App extends React.Component {

  constructor (props) {
    super(props);

    this.state    =   {
      processes   :   props.processes || [],
      filters     :   {
        cmd       :   null
      },
      memory      :   this.props
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

    console.info('Render App', this.props);

    let processes = this.applyFilters();

    return (
      <section>
        <TopBar { ...this.props } />

        <header>
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
              .map( ps => <ProcessRow key={ ps.pid } {...ps} total-memory={ this.props.memory.total } /> )
          }
          {
            processes
              .filter( ps => ps.pid !== window.pid )
              .filter( ps => ( ps.state === 'R' || ps.state === 'S' ) )
              .sort((a,b) => {
                let aMem = parseInt(a.mem);
                let bMem = parseInt(b.mem);

                if ( isNaN(aMem) ) {
                  return 1;
                }

                if ( isNaN(bMem) ) {
                  return -1;
                }

                if ( aMem > bMem ) {
                  return -1;
                }

                if ( aMem < bMem ) {
                  return 1;
                }

                return 0;
              })
              .map( ps => <ProcessRow key={ ps.pid } {...ps} total-memory={ this.props.memory.total } /> )
          }
        </section>
      </section>
    );
  }

}

export default App;
