'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node.isRequired,
  type: React.PropTypes.string,
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
