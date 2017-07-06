'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf([
    'left',
    'right',
    'center',
  ]),
};

const defaultProps = {
  children: null,
  align: 'left',
};

class AppContentTitle extends React.PureComponent {
  render() {
    const props = {
      className: 'app-content-title',
      style: {
        textAlign: this.props.align,
      },
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

AppContentTitle.propTypes = propTypes;
AppContentTitle.defaultProps = defaultProps;

export default AppContentTitle;
