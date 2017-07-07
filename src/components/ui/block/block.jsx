'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  contentPadding: PropTypes.bool,
  id: PropTypes.string,
};

const defaultProps = {
  children: null,
  contentPadding: false,
  id: '',
};

class Block extends React.PureComponent {
  render() {
    const props = {
      className: 'ui-block',
    };

    if (this.props.id) {
      props.id = this.props.id;
    }

    if (this.props.contentPadding) {
      props.className += ' ui-block--with-content-padding';
    }

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
