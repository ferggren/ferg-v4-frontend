'use strict';

import React from 'react';
import './styles';

const propTypes = {
  type: React.PropTypes.oneOf([
    'big',
    'small',
  ]),
};

const defaultProps = {
  type: 'big',
};

class Loader extends React.PureComponent {
  render() {
    return (
      <div className={`loader loader--${this.props.type}`}>
        <div className="loader__dot loader__dot--1" />
        <div className="loader__dot loader__dot--2" />
        <div className="loader__dot loader__dot--3" />
      </div>
    );
  }
}

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;
