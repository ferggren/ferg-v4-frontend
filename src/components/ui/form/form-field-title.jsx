'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
};

const defaultProps = {
  tooltip: null,
};

class FormFieldTitle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.setRefTooltip = this.setRefTooltip.bind(this);

    this.ref_tooltip = false;
  }

  componentWillUnmount() {
    this.ref_tooltip = false;
  }

  setRefTooltip(ref) {
    this.ref_tooltip = ref;
  }

  toggleTooltip() {
    if (!this.ref_tooltip) return;

    let className = 'form__field-title-tooltip';

    if (this.ref_tooltip.className === className) {
      className += ' form__field-title-tooltip--show';
    }

    this.ref_tooltip.className = className;
  }

  makeTooltip() {
    if (!this.props.tooltip) return null;

    return (
      <div className="form__field-title-tooltip" ref={this.setRefTooltip}>
        <div className="form__field-title-tooltip-button" onClick={this.toggleTooltip} />
        <div className="form__field-title-tooltip-popup" onClick={this.toggleTooltip}>
          {this.props.tooltip}
        </div>
        <div className="form__field-title-tooltip-close" onClick={this.toggleTooltip}>
          Close
        </div>
      </div>
    );
  }

  render() {
    let className = 'form__field-title';

    if (this.props.tooltip) {
      className += ' form__field-title--with-tooltip';
    }

    return (
      <div className={className}>
        {this.props.children}
        {this.makeTooltip()}
      </div>
    );
  }
}

FormFieldTitle.propTypes = propTypes;
FormFieldTitle.defaultProps = defaultProps;

export default FormFieldTitle;
