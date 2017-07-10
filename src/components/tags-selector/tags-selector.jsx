'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Block, FormInputSelect, FormInputText } from 'components/ui';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('tags-selector', langRu, 'ru');
Lang.updateLang('tags-selector', langEn, 'en');

const propTypes = {
  tag: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  values: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

const defaultProps = {
  multiple: false,
  lang: 'en',
};

class TagsSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_input: false,
    };

    this.addSelectValue = this.addSelectValue.bind(this);
    this.addInputValue = this.addInputValue.bind(this);
    this.onRemoveValue = this.onRemoveValue.bind(this);
  }

  onRemoveValue(e) {
    this.removeValue(e.target.dataset.value);
  }

  setValue(new_value) {
    this.setState({ show_input: false });

    if (!this.props.multiple) {
      this.props.onSelect(this.props.tag, new_value);
      return;
    }

    const values = [];

    this.props.value.split(',').forEach((value) => {
      value = value.trim();

      if (!value || value === new_value) {
        return;
      }

      values.push(value);
    });

    values.push(new_value);

    this.props.onSelect(this.props.tag, values.join(','));
  }

  removeValue(removed_value) {
    if (!this.props.multiple) {
      this.props.onSelect(this.props.tag, '');
      return;
    }

    const values = [];

    this.props.value.split(',').forEach((value) => {
      value = value.trim();

      if (!value || value === removed_value) {
        return;
      }

      values.push(value);
    });

    this.props.onSelect(this.props.tag, values.join(','));
  }

  addSelectValue(value) {
    if (value === '_default') {
      return;
    }

    if (value === '_create') {
      this.setState({ show_input: true });
      return;
    }

    this.setValue(value);
  }

  addInputValue(value) {
    this.setState({ show_input: false });

    if (!value) {
      return;
    }

    this.setValue(value);
  }

  makeValues() {
    if (!this.props.value) {
      return null;
    }

    const values = [];

    if (this.props.multiple) {
      this.props.value.split(',').forEach((value) => {
        value = value.trim();

        if (!value) {
          return;
        }

        values.push(value);
      });
    } else {
      values.push(this.props.value);
    }

    if (!values.length) {
      return null;
    }

    const ret = values.map((value) => {
      return (
        <Block key={value}>
          <div className="tags-selector__tag" data-value={value} onClick={this.onRemoveValue}>
            <div data-value={value} onClick={this.onRemoveValue} className="tags-selector__tag-name">
              {this.props.name}
            </div>

            <div data-value={value} onClick={this.onRemoveValue} className="tags-selector__tag-value">
              {value}
            </div>
          </div>
        </Block>
      );
    });

    return <Block>{ret}</Block>;
  }

  makeSelect() {
    if (this.state.show_input || (this.props.value && !this.props.multiple)) {
      return null;
    }

    const values = [];

    this.props.values.forEach((value) => {
      values.push({
        text: value, value,
      });
    });

    values.unshift({
      text: this.props.name,
      value: '_default',
    });

    values.push({
      text: Lang('tags-selector.create', this.props.lang),
      value: '_create',
    });

    return (
      <Block>
        <FormInputSelect
          name="value"
          value="_default"
          values={values}
          onChange={this.addSelectValue}
        />
      </Block>
    );
  }

  makeInput() {
    if (!this.state.show_input || (this.props.value && !this.props.multiple)) {
      return null;
    }

    return (
      <Block>
        <FormInputText
          type="text"
          name="tag"
          onSubmit={this.addInputValue}
        />
      </Block>
    );
  }

  render() {
    return (
      <div className="tags-selector">
        {this.makeValues()}
        {this.makeSelect()}
        {this.makeInput()}
      </div>
    );
  }
}

TagsSelector.propTypes = propTypes;
TagsSelector.defaultProps = defaultProps;

export default TagsSelector;
