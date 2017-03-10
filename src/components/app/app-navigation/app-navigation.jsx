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

    this.state = {
      open: false,
    };

    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
  }

  toggleNavigation() {
    this.setState({ open: !this.state.open });
  }

  hideNavigation() {
    this.setState({ open: false });
  }

  makeClassName() {
    let className = 'app-navigation__wrapper';

    if (this.state.open) {
      className += ' app-navigation--open';
    }

    return className;
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
      <div className={this.makeClassName()}>
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
