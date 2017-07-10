'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  name: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  textAlign: PropTypes.string,
  setRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  onSubmit: false,
  id: false,
  name: false,
  action: false,
  textAlign: 'left',
  setRef: false,
};

class Form extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_form = false;

    this.setRefForm = this.setRefForm.bind(this);
  }

  componentWillUnmount() {
    this.ref_form = false;

    if (this.props.setRef) {
      this.props.setRef(null, this.props.name || null);
    }
  }

  setRefForm(c) {
    this.ref_form = c;

    if (this.props.setRef) {
      this.props.setRef(c, this.props.name || null);
    }
  }

  render() {
    const props = {
      className: `form__form form--with-text-align-${this.props.textAlign}`,
      ref: this.setRefForm,
    };

    if (this.props.onSubmit) props.onSubmit = this.props.onSubmit;
    if (this.props.id) props.id = this.props.id;
    if (this.props.name) props.name = this.props.name;
    if (this.props.action) props.action = this.props.action;
    
    return (
      <form {...props}>
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
