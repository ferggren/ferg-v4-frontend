'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  setRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  placeholderEnabled: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  values: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  icon: React.PropTypes.string,
};

const defaultProps = {
  onChange: false,
  setRef: false,
  name: false,
  id: false,
  value: false,
  values: false,
  disabled: false,
  placeholder: false,
  placeholderEnabled: false,
  icon: 'arrow',
};

class FormInputText extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_select = false;

    this.onChange = this.onChange.bind(this);
    this.setRefSelect = this.setRefSelect.bind(this);
  }

  componentWillUnmount() {
    this.ref_select = false;

    if (this.props.setRef) {
      this.props.setRef(null, this.props.name || null);
    }
  }

  onChange() {
    if (this.props.disabled) return;
    if (!this.ref_select) return;

    const select = this.ref_select;
    const value = select.options[select.selectedIndex].value;

    if (value === this.props.value) return;
    if (!this.props.onChange) return;

    this.props.onChange(value, this.props.name || null);
  }

  setRefSelect(c) {
    this.ref_select = c;

    if (this.props.setRef) {
      this.props.setRef(c, this.props.name || null);
    }
  }

  makeItems() {
    if (!this.props.values) return [];

    const items = [];

    if (this.props.placeholderEnabled) {
      items.push(
        <option key="default" value={false}>
          {this.props.placeholder || 'Select...'}
        </option>
      );
    }

    this.props.values.forEach((item) => {
      items.push(
        <option key={item.value} value={item.value}>
          {item.text}
        </option>
      );
    });

    return items;
  }

  makeTitle() {
    if (this.props.values) {
      for (let i = 0; i < this.props.values.length; ++i) {
        const item = this.props.values[i];

        if (item.value === this.props.value) {
          return item.text;
        }
      }
    }

    if (this.props.placeholder) {
      return this.props.placeholder;
    }

    return 'Select...';
  }

  render() {
    const selectProps = {
      className: 'form__selector-select',
      disabled: this.props.disabled,
      onChange: this.onChange,
      ref: this.setRefSelect,
    };

    const titleProps = {
      className: 'form__selector-title',
    };

    if (this.props.disabled) {
      titleProps.className += ' form__selector-title--disabled';
    } else {
      titleProps.className += ' form__selector-title--enabled';
    }

    if (this.props.value) {
      selectProps.value = this.props.value;
    }

    if (this.props.name) {
      selectProps.name = this.props.name;
    }

    if (this.props.id) {
      selectProps.id = this.props.id;
    }

    return (
      <div className="form__selector-wrapper">
        <div {...titleProps}>{this.makeTitle()}</div>
        <div className={`form__selector-button form__selector-button--${this.props.icon}`} />

        <select {...selectProps}>
          {this.makeItems()}
        </select>
      </div>
    );
  }
}

FormInputText.propTypes = propTypes;
FormInputText.defaultProps = defaultProps;

export default FormInputText;
