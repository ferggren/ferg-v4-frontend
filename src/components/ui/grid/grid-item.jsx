'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  textAlign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  withContentPadding: PropTypes.bool,
  align: PropTypes.oneOf([
    'auto',
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'stretch',
  ]),
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  order: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  grow: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
};

const defaultProps = {
  children: null,
  textAlign: false,
  withContentPadding: false,
  align: 'auto',
  width: false,
  order: false,
  grow: false,
};

class GridItem extends React.PureComponent {
  render() {
    const props = {
      className: 'ui-grid__item',
      style: {},
    };

    if (this.props.align) {
      props.style.alignSelf = this.props.align;
    }

    if (this.props.textAlign) {
      props.style.textAlign = this.props.textAlign;
    }

    if (this.props.withContentPadding) {
      props.className += ' ui-grid__item--with-content-padding';
    }

    if (this.props.width) {
      props.style.width = this.props.width;
    }

    if (this.props.order !== false) {
      props.style.order = this.props.order;
    }

    if (this.props.grow !== false) {
      props.style.flexGrow = this.props.grow;
    }

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

GridItem.propTypes = propTypes;
GridItem.defaultProps = defaultProps;

export default GridItem;
