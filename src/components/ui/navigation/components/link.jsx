'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

class NavigationLink extends React.PureComponent {
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
      className: 'ui-nav__link',
      onClick: this.onClick,
    };

    if (item.current === true) {
      props.className += ' ui-nav__link--current';
    }

    let link = null;
    
    if (item.routed === false) {
      link = <a href={item.link || null}>{item.name}</a>;
    } else {
      link = <Link to={item.link || null}>{item.name}</Link>;
    }

    return (
      <li {...props}>
        {link}
      </li>
    );
  }
}

NavigationLink.propTypes = propTypes;

export default NavigationLink;
