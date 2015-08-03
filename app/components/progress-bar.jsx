'use strict';

import React from 'react';

let i = 0;

class ProgressBar extends React.Component {
  render () {
    let width = this.props.current / this.props.goal * 100;

    width = parseInt(width);
    let percent;
    let background = 'transparent';

    if ( ! isNaN(width) ) {
      percent = width.toFixed(2) + '%';

      if ( width > 0 && width < 40 ) {
        background = 'green';
      }
      else if ( width >= 40 && width < 80 ) {
        background = 'orange';
      }
      else if ( width >= 80 ) {
        background = 'red';
      }
    }

    i ++;

    if ( i < 10 ) {
      console.log({ props: this.props, width: width });
    }

    return (
      <div className="progress_bar">
        <div
          className   =   "progress_bar-percent"
          style={ {
            width : `${width}%`, background
          }}></div>
        <div className="progress_bar-label">{ `${width}%` }</div>
      </div>
    );
  }
}

export default ProgressBar;
