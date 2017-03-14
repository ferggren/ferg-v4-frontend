'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
  align: React.PropTypes.oneOf([
    'auto',
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'stretch',
  ]),
  width: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  order: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};

const defaultProps = {
  children: null,
  align: 'auto',
  width: false,
  order: false,
};

class AppGridItem extends React.PureComponent {
  render() {
    const item_class = 'app-grid__item';
    const style = {};

    if (this.props.align) {
      style.alignSelf = this.props.align;
    }

    if (this.props.width) {
      style.width = this.props.width;
    }

    if (this.props.order !== false) {
      style.order = this.props.order;
    }

    return (
      <div className={item_class} style={style}>
        {this.props.children}
      </div>
    );
  }
}

AppGridItem.propTypes = propTypes;
AppGridItem.defaultProps = defaultProps;

export default AppGridItem;
