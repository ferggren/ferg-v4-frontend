'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
};

const defaultProps = {
  children: null,
};

class AppContainer extends React.PureComponent {
  render() {
    return (
      <div className="app__wrapper">
        {this.props.children}
      </div>
    );
  }
}

AppContainer.propTypes = propTypes;
AppContainer.defaultProps = defaultProps;

export default AppContainer;
