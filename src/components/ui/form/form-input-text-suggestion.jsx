'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  onClick: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onMouseOver: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

const defaultProps = {
  onClick: false,
  onMouseOver: false,
  text: '',
  data: false,
};

class FormInputTextSuggestion extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (!this.props.onClick) return;
    this.props.onClick(this.props.data, this.props.text);
  }

  render() {
    const props = {
      onClick: this.onClick,
      className: 'form__input-text-suggestions-suggestion',
    };

    if (this.props.onMouseOver) props.onMouseOver = this.props.onMouseOver;

    return (
      <div {...props}>
        {this.props.text}
      </div>
    );
  }
}

FormInputTextSuggestion.defaultProps = defaultProps;
FormInputTextSuggestion.propTypes = propTypes;

export default FormInputTextSuggestion;
