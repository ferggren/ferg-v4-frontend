'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

const defaultProps = {
  type: 'success',
};

class FormCallout extends React.PureComponent {
  render() {
    return (
      <div className={`form__callout form__callout--${this.props.type}`}>
        {this.props.children}
      </div>
    );
  }
}

FormCallout.propTypes = propTypes;
FormCallout.defaultProps = defaultProps;

export default FormCallout;
