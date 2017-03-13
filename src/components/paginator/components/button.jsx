'use strict';

import React from 'react';
import { Link } from 'react-router';

const propTypes = {
  page: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  title: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  url: React.PropTypes.string,
  active: React.PropTypes.bool,
  onSelect: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.bool,
  ]),
};

const defaultProps = {
  url: '',
  onSelect: false,
  active: false,
  title: '',
  page: '',
};

class PaginatorButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (!this.props.onSelect) return;

    e.preventDefault();
    e.stopPropagation();

    this.props.onSelect(this.props.page);
  }

  render() {
    const props = {
      className: 'paginator__button',
    };

    if (!this.props.active) {
      props.className += ' paginator__button--inactive';
    }

    if (this.props.url && this.props.active) {
      props.to = this.props.url.replace('%page%', this.props.page);
    }

    if (this.props.active && typeof this.props.onSelect === 'function') {
      props.onClick = this.onClick;
    }

    return (
      <Link {...props}>{this.props.title}</Link>
    );
  }
}

PaginatorButton.propTypes = propTypes;
PaginatorButton.defaultProps = defaultProps;

export default PaginatorButton;
