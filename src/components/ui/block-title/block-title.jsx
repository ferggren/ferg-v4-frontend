'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf([
    'left',
    'right',
    'center',
  ]),
};

const defaultProps = {
  children: null,
  align: 'left',
};

class BlockTitle extends React.PureComponent {
  render() {
    const props = {
      className: 'ui-content-title',
      style: {
        textAlign: this.props.align,
      },
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

BlockTitle.propTypes = propTypes;
BlockTitle.defaultProps = defaultProps;

export default BlockTitle;
