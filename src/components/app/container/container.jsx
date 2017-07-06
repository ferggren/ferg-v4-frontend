'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

class AppContainer extends React.PureComponent {
  render() {
    return (
      <div className="app-wrapper">
        {this.props.children}
      </div>
    );
  }
}

AppContainer.propTypes = propTypes;
AppContainer.defaultProps = defaultProps;

export default AppContainer;
