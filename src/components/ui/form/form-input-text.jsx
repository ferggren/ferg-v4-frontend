'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import FormInputTextSuggestion from './form-input-text-suggestion';
import './styles';

const propTypes = {
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onClick: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onFocus: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onBlur: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onKeyDown: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onSuggestionSelect: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onSubmit: PropTypes.oneOfType([
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
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  highlighted: PropTypes.bool,
  showSuggestions: PropTypes.bool,
  suggestionsList: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  autoComplete: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  readOnly: PropTypes.bool,
  focusOnMount: PropTypes.bool,
};

const defaultProps = {
  onChange: false,
  onBlur: false,
  onClick: false,
  onFocus: false,
  onSubmit: false,
  onKeyDown: false,
  onSuggestionSelect: false,
  suggestionsList: false,
  setRef: false,
  disabled: false,
  type: 'text',
  name: false,
  id: false,
  multiline: false,
  value: false,
  placeholder: false,
  highlighted: false,
  icon: false,
  showSuggestions: false,
  autoComplete: false,
  readOnly: false,
  focusOnMount: false,
};

class FormInputText extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_suggestions: props.showSuggestions,
    };

    this.ref_input = false;
    this.last_value = false;
    this.suggestions_timeout = false;

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setRefInput = this.setRefInput.bind(this);
    this.timeoutHideSuggestions = this.timeoutHideSuggestions.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
  }

  componentDidMount() {
    if (this.props.focusOnMount && this.ref_input) {
      this.ref_input.focus();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.showSuggestions !== this.props.showSuggestions) {
      this.setState({ show_suggestions: nextProps.showSuggestions });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.ref_input &&
        prevProps.value !== this.props.value &&
        this.ref_input.value !== this.props.value) {
      this.ref_input.value = this.props.value || '';
    }
  }

  componentWillUnmount() {
    this.ref_input = false;
    this.last_value = false;

    if (this.props.setRef) {
      this.props.setRef(null, this.props.name || null);
    }

    if (this.suggestions_timeout) {
      clearTimeout(this.suggestions_timeout);
      this.suggestions_timeout = false;
    }
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    if (!this.props.multiline && this.props.onSubmit && e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      
      this.props.onSubmit(this.ref_input.value, this.props.name || null);
    }
  }

  onChange() {
    if (!this.ref_input) return;

    if (this.props.onChange) {
      this.props.onChange(this.ref_input.value, this.props.name || null);
    }
  }

  onBlur() {
    this.hideSuggestions();

    if (!this.ref_input) return;

    if (this.props.onBlur) {
      this.props.onBlur(this.ref_input.value, this.props.name || null);
    }
  }

  onFocus() {
    this.showSuggestions();

    if (!this.ref_input) return;

    if (this.props.onFocus) {
      this.props.onFocus(this.ref_input.value, this.props.name || null);
    }
  }

  setRefInput(c) {
    this.ref_input = c;

    if (this.props.setRef) {
      this.props.setRef(c, this.props.name || null);
    }
  }

  showSuggestions() {
    if (this.suggestions_timeout) {
      clearTimeout(this.suggestions_timeout);
      this.suggestions_timeout = false;
    }

    if (this.state.show_suggestions) return;
    if (!this.props.showSuggestions) return;

    this.setState({ show_suggestions: true });
  }

  hideSuggestions() {
    if (this.suggestions_timeout) {
      clearTimeout(this.suggestions_timeout);
      this.suggestions_timeout = false;
    }

    if (!this.state.show_suggestions) return;
    this.setState({ show_suggestions: false });
  }

  timeoutHideSuggestions() {
    if (this.suggestions_timeout) {
      clearTimeout(this.suggestions_timeout);
    }

    this.suggestions_timeout = setTimeout(this.hideSuggestions, 1000);
  }

  makeSuggestions() {
    let className = 'form__input-text-suggestions';

    if (this.state.show_suggestions) {
      className += ' form__input-text-suggestions--visible';
    } else {
      className += ' form__input-text-suggestions--hidden';
    }

    return (
      <div className={className}>
        {this.makeSuggestionsList()}
      </div>
    );
  }

  makeSuggestionsList() {
    if (!this.props.suggestionsList.length) return null;

    const ret = [];

    this.props.suggestionsList.forEach((suggestion, index) => {
      /* eslint-disable react/no-array-index-key */

      ret.push(
        <FormInputTextSuggestion
          key={`${suggestion.text}_${index}`}
          onClick={this.props.onSuggestionSelect}
          onMouseOver={this.showSuggestions}
          text={suggestion.text}
          data={suggestion.data}
        />
      );
    });

    return ret;
  }

  makeIcon() {
    if (!this.props.icon) return null;

    const props = {
      className: 'form__input-text-icon',
    };

    props.className += ` form__input-text-icon--${this.props.icon}`;

    if (this.props.onClick) props.onClick = this.props.onClick;

    return <div {...props} />;
  }

  render() {
    const props = {
      className: 'form__input-text',
      type: this.props.type,
      disabled: this.props.disabled,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onKeyDown: this.onKeyDown,
      defaultValue: this.props.value || '',
      ref: this.setRefInput,
    };

    if (this.props.readOnly) props.readOnly = true;
    if (this.props.onClick) props.onClick = this.props.onClick;
    if (this.props.name) props.name = this.props.name;
    if (this.props.id) props.id = this.props.id;
    if (this.props.placeholder) props.placeholder = this.props.placeholder;
    if (this.props.autoComplete) props.autoComplete = this.props.autoComplete;
    if (this.props.icon) props.className += ' form__input-text--with-icon';

    if (this.props.disabled) {
      props.className += ' form__input-text--disabled';
    } else {
      props.className += ' form__input-text--enabled';
    }

    if (this.props.highlighted) {
      props.className += ' form__input-text--highlighted';
    }

    let input = null;

    if (!this.props.multiline) {
      props.className += ' form__input-text--singleline';
      input = <input {...props} />;
    } else {
      props.className += ' form__input-text--multiline';
      input = <textarea {...props} />;
    }

    return (
      <div className="form__input-text-wrapper" onMouseOut={this.timeoutHideSuggestions} onMouseOver={this.showSuggestions}>
        {this.makeIcon()}
        {input}
        {this.makeSuggestions()}
      </div>
    );
  }
}

FormInputText.propTypes = propTypes;
FormInputText.defaultProps = defaultProps;

export default FormInputText;
