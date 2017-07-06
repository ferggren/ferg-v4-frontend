'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { titleWebsite } from 'data/title-config';

const propTypes = {
  title: PropTypes.string.isRequired,
};

class FergTitleWatcher extends React.PureComponent {
  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.updateTitle();
    }
  }

  updateTitle() {
    document.title = `${this.props.title} ${titleWebsite}`;
  }

  render() {
    return null;
  }
}

FergTitleWatcher.propTypes = propTypes;

export default connect((state) => {
  return {
    title: state.title,
  };
})(FergTitleWatcher);
