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

class Container extends React.PureComponent {
  render() {
    return (
      <div className="ui-wrapper">
        {this.props.children}
      </div>
    );
  }
}

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
