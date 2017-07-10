'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  contentPadding: PropTypes.bool,
  id: PropTypes.string,
  minWidth: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
};

const defaultProps = {
  children: null,
  contentPadding: false,
  id: '',
  minWidth: false,
  width: false,
};

class Block extends React.PureComponent {
  render() {
    const props = {
      className: 'ui-block',
      style: {},
    };

    if (this.props.id) props.id = this.props.id;
    if (this.props.minWidth) props.style.minWidth = this.props.minWidth;
    if (this.props.width) props.style.width = this.props.width;
    if (this.props.contentPadding) props.className += ' ui-block--with-content-padding';

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

Block.propTypes = propTypes;
Block.defaultProps = defaultProps;

export default Block;
