'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const propTypes = {
  location: PropTypes.string.isRequired,
};

class Tracker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ya_counter = false;
  }

  componentWillReceiveProps(next_props) {
    if (this.props.location === next_props.location) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.ga !== 'undefined') {
      window.ga('set', 'referrer', this.props.location);
      window.ga('set', 'page', next_props.location);
      window.ga('send', 'pageview');
    }

    if (!this.ya_counter && typeof window.Ya !== 'undefined') {
      this.ya_counter = new window.Ya.Metrika({
        id: window.__YAID,
      });
    }

    if (this.ya_counter) {
      this.ya_counter.hit(next_props.location, {
        referer: this.props.location,
      });
    }
  }

  componentWillUnmount() {
    this.ya_counter = false;
  }

  render() {
    return null;
  }
}

Tracker.propTypes = propTypes;

export default connect((state) => {
  return {
    location: state.location,
  };
})(Tracker);
