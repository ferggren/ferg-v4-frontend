'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
};

const defaultProps = {
  onClick: false,
};

class FormLabel extends React.PureComponent {
  render() {
    return (
      <div className="form__label" onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

FormLabel.propTypes = propTypes;
FormLabel.defaultProps = defaultProps;

export default FormLabel;
