'use strict';

import React from 'react';

class ProcessRow extends React.Component {

  memUsed (mem) {
    if ( typeof window !== 'undefined' && ! isNaN(mem) ) {
      let width = mem / window.totalMem * 100;

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
    else {
      return { opacity : 0 };
    }
  }

  render () {
    let memUsed = this.memUsed(parseInt(this.props.mem));
    let width = parseInt(memUsed.width);
    let percent;

    if ( ! isNaN(width) ) {
      percent = width.toFixed(2) + '%';
    }

    return (
      <article className="row">
        <div className="column-10">{ this.props.pid }</div>
        <div className="column-60">{ this.props.cmd }</div>
        <div className="column-20">
          <div className="memory-bar">
            <div className="memory-used" style={ memUsed }></div>
            <div className="memory-percent">
              { percent }
            </div>
          </div>
        </div>
      </article>
    );
  }

}

export default ProcessRow;
