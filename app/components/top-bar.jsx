'use strict';

import React from 'react';
import ProgressBar from './progress-bar';

class TopBar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      totalMem : 0,
      freeMem : 0
    };

    this.setComponent();
  }

  setComponent () {
    if ( typeof window !== 'undefined' ) {
      if ( ! window.socket ) {
        return this.waitForSocket = window.setInterval(() => {
          if ( window.socket ) {
            window.clearInterval(this.waitForSocket);
            this.setComponent();
          }
        }, 1000);
      }

      if ( window.totalMem ) {
        this.setState({ totalMem : window.totalMem });
      }
      else {
        window.socket.on('total mem', totalMem => {
          this.setState({ totalMem });
        });
      }

      window.socket.on('free mem', freeMem => {
        this.setState({ freeMem });
      });
    }
  }

  render () {
    let { totalMem, freeMem } = this.state;
    let usedMem = totalMem - freeMem;

    return (
      <header className="top-bar">
        <div style={ { width: '50%', float: 'left' }}>
          <h1>
            PS|JS
            <small>{ this.props.processes.length } processes</small>
          </h1>
        </div>
        <div style={ { width: '50%', float: 'right', 'text-align': 'right' }}>
          <h2>
            <ProgressBar goal={ totalMem } current={ usedMem } />
            <ProgressBar label="CPU (8)" goal={ 2500 } current={ 700 } />

            <i className="fa fa-bar-chart"></i>
            <i className="fa fa-search"></i>
          </h2>
        </div>
      </header>
    );
  }
}

export default TopBar;
