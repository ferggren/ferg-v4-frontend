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
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  setRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  onClick: false,
  width: '100%',
  type: 'default',
  id: null,
  disabled: false,
  setRef: false,
  name: false,
};

class FormButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_button = false;

    this.setRefButton = this.setRefButton.bind(this);
  }

  componentWillUnmount() {
    this.ref_button = false;

    if (this.props.setRef) {
      this.props.setRef(null, this.props.name || null);
    }
  }

  setRefButton(c) {
    this.ref_button = c;
    
    if (this.props.setRef) {
      this.props.setRef(c, this.props.name || null);
    }
  }

  render() {
    const props = {
      className: 'form__button',
      onClick: this.props.onClick,
      style: {},
      id: this.props.id,
      ref: this.setRefButton,
    };

    if (this.props.type) props.className += ` form__button--${this.props.type}`;
    if (this.props.width) props.style.width = this.props.width;
    if (this.props.name) props.name = this.props.name;

    if (this.props.disabled) {
      props.className += ' form__button--disabled';
    } else {
      props.className += ' form__button--enabled';
    }

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

FormButton.propTypes = propTypes;
FormButton.defaultProps = defaultProps;

export default FormButton;
