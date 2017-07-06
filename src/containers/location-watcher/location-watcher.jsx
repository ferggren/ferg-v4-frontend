'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { setLocation } from 'actions/location';

const propTypes = {
  lang: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

class LocationWatcher extends React.PureComponent {
  constructor(props) {
    super(props);

    this.updateLocation = this.updateLocation.bind(this);

    this.unlisten = false;
  }

  componentDidMount() {
    this.unlisten = browserHistory.listen(this.updateLocation);
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = false;
    }
  }

  updateLocation(location) {
    if (!this.props.lang) return;
    
    location = location.pathname + location.search;
    location = location.replace(/[?]$/, '');

    if (!location.match(/^\/(en|ru)/)) {
      location = location.replace(/^\/(en|ru)/, '');
      location = '/' + this.props.lang + location;
    }

    if (this.props.location === location) return;
    
    this.props.dispatch(setLocation(location));
  }

  render() {
    return null;
  }
}

LocationWatcher.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
  };
})(LocationWatcher);
