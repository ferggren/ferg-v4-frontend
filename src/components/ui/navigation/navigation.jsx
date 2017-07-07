'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import NavigationLink from './components/link';
import './styles';

const propTypes = {
  navigation: PropTypes.array,
  title: PropTypes.string,
  style: PropTypes.oneOf([
    'transparent',
    'white',
  ]),
};

const defaultProps = {
  navigation: [],
  style: 'white',
  title: '',
};

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
    this.preventScroll = this.preventScroll.bind(this);
  }

  toggleNavigation() {
    this.setState({ open: !this.state.open });
  }

  hideNavigation() {
    this.setState({ open: false });
  }

  makeClassName() {
    let className = 'ui-nav__wrapper';
    className += ` ui-nav__wrapper--${this.props.style}`;
    className += ` ui-nav--${this.props.style}`;

    if (this.state.open) {
      className += ' ui-nav--open';
    }

    return className;
  }

  makeNavigation() {
    const ret = [];

    ['left', 'right'].forEach((align) => {
      const links = this.makeNavigationLinks(align);

      if (!links.length) return;

      let className = 'ui-nav__links-block';
      className += ` ui-nav__links-block--${align}`;

      ret.push(
        <ul key={align} className={className}>
          {links}
        </ul>
      );
    });

    return ret;
  }

  makeNavigationLinks(align) {
    const ret = [];

    this.props.navigation.forEach((item) => {
      const item_align = item.align === 'right' ? 'right' : 'left';

      if (item_align !== align) {
        return;
      }

      ret.push(
        <NavigationLink
          item={item}
          onClick={this.hideNavigation}
          key={item.name + item.link}
        />
      );
    });

    return ret;
  }

  preventScroll(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <div className={this.makeClassName()}>
        <div className="ui-nav">
          <h1 className="ui-nav__title">
            {this.props.title}
          </h1>

          <div
            className="ui-nav__links"
            onWheel={this.preventScroll}
            onScroll={this.preventScroll}
            onTouchMove={this.preventScroll}
          >
            {this.makeNavigation()}
            <div style={{ clear: 'both' }} />
          </div>

          <div
            onClick={this.toggleNavigation}
            className="ui-nav__shadow"
            onWheel={this.preventScroll}
            onScroll={this.preventScroll}
            onTouchMove={this.preventScroll}
          />

          <div
            className="ui-nav__toggle"
            onClick={this.toggleNavigation}
          />
        </div>
      </div>
    );
  }
}

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

export default Navigation;
