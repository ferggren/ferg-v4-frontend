'use strict';

import React from 'react';
import Link from './components/link';
import './styles';

const propTypes = {
  navigation: React.PropTypes.array,
  title: React.PropTypes.string,
};

const defaultProps = {
  navigation: [],
  title: '',
};

class AppNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_wrapper = false;

    this.setRefWrapper = this.setRefWrapper.bind(this);
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
  }

  setRefWrapper(c) {
    this.ref_wrapper = c;
  }

  toggleNavigation() {
    if (!this.ref_wrapper) return;

    let className = 'app-navigation__wrapper';

    if (this.ref_wrapper.className === className) {
      className += ' app-navigation--open';
    }

    this.ref_wrapper.className = className;
  }

  hideNavigation() {
    if (!this.ref_wrapper) return;
    this.ref_wrapper.className = 'app-navigation__wrapper';
  }

  render() {
    const items = this.props.navigation.map((item) => {
      return (
        <Link
          item={item}
          onClick={this.hideNavigation}
          key={item.name + item.link}
        />
      );
    });

    return (
      <div className="app-navigation__wrapper" ref={this.setRefWrapper}>
        <div className="app-navigation__title">
          {this.props.title}
        </div>

        <div className="app-navigation__links">
          {items}
          <div style={{ clear: 'both' }} />
        </div>

        <div
          onClick={this.toggleNavigation}
          className="app-navigation__shadow"
        />

        <div
          className="app-navigation__toggle"
          onClick={this.toggleNavigation}
        />
      </div>
    );
  }
}

AppNavigation.propTypes = propTypes;
AppNavigation.defaultProps = defaultProps;

export default AppNavigation;
