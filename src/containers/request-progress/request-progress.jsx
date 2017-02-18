'use strict';

import React from 'react';
import Request from 'libs/request';

class RequestProgress extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.update_interval = false;

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentDidMount() {
    this.update_interval = setInterval(this.updateProgress, 250);
  }

  componentWillUnmount() {
    if (this.update_interval) {
      clearInterval(this.update_interval);
      this.update_interval = false;
    }
  }

  updateProgress() {
    // console.log('update progress');
  }

  render() {
    return null;
  }
}

export default RequestProgress;
