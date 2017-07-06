'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const propTypes = {
  children: PropTypes.node,
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
  ]),
  alignItems: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'stretch',
  ]),
  direction: PropTypes.oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse',
  ]),
};

const defaultProps = {
  children: null,
  direction: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

class ContentGrid extends React.PureComponent {
  render() {
    const style = {
      flexDirection: this.props.direction,
      justifyContent: this.props.justifyContent,
      alignItems: this.props.alignItems,
    };

    return (
      <div className="app-grid" style={style}>
        {this.props.children}
      </div>
    );
  }
}

ContentGrid.propTypes = propTypes;
ContentGrid.defaultProps = defaultProps;

export default ContentGrid;
