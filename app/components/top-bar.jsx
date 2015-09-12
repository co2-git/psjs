'use strict';

import React from 'react';
import ProgressBar from './progress-bar';

class TopBar extends React.Component {
  render () {
    let { memory, processes, cpu } = this.props;
    memory.used = memory.total - memory.free;

    return (
      <header className="top-bar row">
        <div>
          <h1>
            PS|JS
            <small>{ processes.length } processes</small>
          </h1>
        </div>
        <div>
          <h2>
            <div className="progress_bar-wrapper">
              <ProgressBar goal={ memory.total } current={ memory.used } />
            </div>
            <ProgressBar goal={ 100 } current={ cpu.load } />

            <i className="fa fa-eye"></i>
            <input type="text" placeholder="Search" name="search" />
            <i className="fa fa-search"></i>
          </h2>
        </div>
      </header>
    );
  }
}

export default TopBar;
