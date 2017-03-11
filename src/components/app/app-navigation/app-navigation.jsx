'use strict';

import React from 'react';
import Link from './components/link';
import './styles';

const propTypes = {
  navigation: React.PropTypes.array,
  title: React.PropTypes.string,
  style: React.PropTypes.oneOf([
    'transparent',
    'white',
  ]),
};

const defaultProps = {
  navigation: [],
  style: 'white',
  title: '',
};

class AppNavigation extends React.PureComponent {
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
    let className = 'app-navigation__wrapper';
    className += ` app-navigation__wrapper--${this.props.style}`;
    className += ` app-navigation--${this.props.style}`;

    if (this.state.open) {
      className += ' app-navigation--open';
    }

    return className;
  }

  makeNavigation() {
    const ret = [];

    ['left', 'right'].forEach((align) => {
      const links = this.makeNavigationLinks(align);

      if (!links.length) return;

      let className = 'app-navigation__links-block';
      className += ` app-navigation__links-block--${align}`;

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
        <Link
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
        <div className="app-navigation">
          <h1 className="app-navigation__title">
            {this.props.title}
          </h1>

          <div
            className="app-navigation__links"
            onWheel={this.preventScroll}
            onScroll={this.preventScroll}
            onTouchMove={this.preventScroll}
          >
            {this.makeNavigation()}
            <div style={{ clear: 'both' }} />
          </div>

          <div
            onClick={this.toggleNavigation}
            className="app-navigation__shadow"
            onWheel={this.preventScroll}
            onScroll={this.preventScroll}
            onTouchMove={this.preventScroll}
          />

          <div
            className="app-navigation__toggle"
            onClick={this.toggleNavigation}
          />
        </div>
      </div>
    );
  }
}

AppNavigation.propTypes = propTypes;
AppNavigation.defaultProps = defaultProps;

export default AppNavigation;
