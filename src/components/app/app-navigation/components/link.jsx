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
      key: item.name + item.link,
      onClick: this.onClick,
    };

    if (item.align === 'right') {
      props.className += ' app-navigation__link--right';
    }

    if (item.current === true) {
      props.className += ' app-navigation__link--current';
    }

    if (item.routed === false) {
      if (item.link) props.href = item.link;
      return <a {...props}>{item.name}</a>;
    }

    if (item.link) props.to = item.link;
    return <Link {...props}>{item.name}</Link>;
  }
}

AppNavigationLink.propTypes = propTypes;

export default AppNavigationLink;
