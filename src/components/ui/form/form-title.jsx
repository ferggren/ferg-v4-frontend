'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  withPaddingTop: PropTypes.bool,
  textAlign: PropTypes.string,
  kind: PropTypes.string,
};

const defaultProps = {
  withPaddingTop: false,
  textAlign: 'center',
  kind: 'big',
};

class FormTitle extends React.PureComponent {
  render() {
    let className = 'form__title';
    className += ` form__title--with-align-${this.props.textAlign}`;
    className += ` form__title--kind-${this.props.kind}`;

    if (this.props.withPaddingTop) {
      className += ' form__title--with-padding-top';
    }

    return (
      <h2 className={className}>
        {this.props.children}
      </h2>
    );
  }
}

FormTitle.propTypes = propTypes;
FormTitle.defaultProps = defaultProps;

export default FormTitle;
