'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  textAlign: PropTypes.string,
};

const defaultProps = {
  textAlign: 'left',
};

class FormDesc extends React.PureComponent {
  render() {
    return (
      <h5 className={`form__desc form__desc--with-align-${this.props.textAlign}`}>
        {this.props.children}
      </h5>
    );
  }
}

FormDesc.propTypes = propTypes;
FormDesc.defaultProps = defaultProps;

export default FormDesc;
