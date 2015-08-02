'use strict';

import React from 'react';

class Memory extends React.Component {
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

  memUsed () {
    let width = this.state.freeMem / this.state.totalMem * 100;

    let background = 'transparent';

    if ( width > 0 && width < 40 ) {
      background = 'green';
    }
    else if ( width >= 40 && width < 80 ) {
      background = 'orange';
    }
    else if ( width >= 80 ) {
      background = 'red';
    }

    return { width : `${width}%`, background };
  }

  render () {
    let memUsed = this.memUsed();
    let width = parseInt(memUsed.width);
    let percent;

    if ( ! isNaN(width) ) {
      percent = width.toFixed(2) + '%';
    }

    return (
      <section>
        <h2>Memory { this.state.totalMem }</h2>
        <div className="memory-bar">
          <div className="memory-used" style={ memUsed }></div>
          <div className="memory-percent">
            { percent }
          </div>
        </div>
      </section>
    );
  }
}

export default Memory;
