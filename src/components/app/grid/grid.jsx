'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
  direction: React.PropTypes.oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse',
  ]),
};

const defaultProps = {
  children: null,
  direction: 'row',
};

class AppGrid extends React.PureComponent {
  render() {
    const style = {
      flexDirection: this.props.direction,
    };

    return (
      <div className="app-grid" style={style}>
        {this.props.children}
      </div>
    );
  }
}

AppGrid.propTypes = propTypes;
AppGrid.defaultProps = defaultProps;

export default AppGrid;
