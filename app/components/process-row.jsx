'use strict';

import React from 'react';
import ProgressBar from './progress-bar';

class ProcessRow extends React.Component {
  render () {

    let mem = parseInt(this.props.mem);

    if ( isNaN(mem) ) {
      mem = 0;
    }

    return (
      <article className="row">
        <div className="column-pid">{ this.props.pid }</div>
        <div className="column-cmd">{ this.props.cmd }</div>
        <div className="column-mem">
          <ProgressBar goal={ this.props['total-memory'] } current={ mem } />
        </div>
      </article>
    );
  }

}

export default ProcessRow;
