'use strict';

import React from 'react';
import { Link } from 'react-router';

const propTypes = {
  onClick: React.PropTypes.func.isRequired,
  item: React.PropTypes.object.isRequired,
};

class AppNavigationLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }

    if (this.props.item.onClick) {
      this.props.item.onClick();
    }
  }

  render() {
    const item = this.props.item;
    const props = {
      className: 'app-navigation__link',
      onClick: this.onClick,
    };

    if (item.current === true) {
      props.className += ' app-navigation__link--current';
    }

    if (item.routed === false) {
      return (
        <li {...props}>
          <a href={item.link || null}>{item.name}</a>
        </li>
      );
    }

    return (
      <li {...props}>
        <Link to={item.link || null}>{item.name}</Link>
      </li>
    );
  }
}

AppNavigationLink.propTypes = propTypes;

export default AppNavigationLink;
