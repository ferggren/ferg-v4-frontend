'use strict';

import React from 'react';
import Request from 'libs/request';
import './styles';

class RequestProgress extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
    };

    this.update_interval = false;

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentDidMount() {
    this.update_interval = setInterval(this.updateProgress, 200);
  }

  componentWillUnmount() {
    if (this.update_interval) {
      clearInterval(this.update_interval);
      this.update_interval = false;
    }
  }

  updateProgress() {
    const total = Request.getTotalProgress();

    if (!total.requests_total) {
      if (this.state.progress) {
        this.setState({ progress: 0 });
      }

      return;
    }

    const progress = this.calcProgress(total);
    const part = (100 - this.state.progress) / 2;
    const part_progress = (progress / 125) * part;
    const total_progress = Math.round(part_progress + this.state.progress);

    if (total_progress <= this.state.progress) return;

    this.setState({ progress: total_progress });
  }

  calcProgress(total) {
    let mod = 0;
    let loaded = 0;
    let uploaded = 0;

    if (total.loaded_total) {
      loaded = (total.loaded * 100) / total.loaded_total;
      ++mod;
    }

    if (total.uploaded_total) {
      uploaded = (total.uploaded * 100) / total.uploaded_total;
      ++mod;
    }

    if (mod <= 0) return 0;

    mod = 1 / mod;

    return (loaded * mod) + (uploaded * mod);
  }

  render() {
    let wrapper_class = 'request-progress-wrapper';
    const progress_style = { width: `${this.state.progress}%` };

    if (!this.state.progress) {
      wrapper_class += ' request-progress-wrapper--hidden';
    }

    return (
      <div className={wrapper_class}>
        <div className="request-progress" style={progress_style} />
      </div>
    );
  }
}

export default RequestProgress;
