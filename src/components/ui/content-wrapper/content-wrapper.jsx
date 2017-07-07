'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  navigationOverlap: PropTypes.bool,
  navigationPadding: PropTypes.bool,
  id: PropTypes.string,
};

const defaultProps = {
  children: null,
  fullWidth: false,
  navigationOverlap: false,
  navigationPadding: true,
  id: '',
};

class Block extends React.PureComponent {
  render() {
    const props = {
      className: 'ui-content-wrapper',
    };

    if (this.props.id) props.id = this.props.id;

    if (this.props.fullWidth) {
      props.className += ' ui-content-wrapper--full-width';
    } else {
      props.className += ' ui-content-wrapper--centered';
    }

    if (this.props.navigationOverlap) {
      props.className += ' ui-content-wrapper--with-navigation-overlap';
    } else if (this.props.navigationPadding) {
      props.className += ' ui-content-wrapper--with-navigation-padding';
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
