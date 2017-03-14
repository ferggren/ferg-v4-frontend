'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
  expand: React.PropTypes.bool,
  overlapHeader: React.PropTypes.bool,
  paddingTop: React.PropTypes.bool,
  contentPadding: React.PropTypes.bool,
  id: React.PropTypes.string,
};

const defaultProps = {
  children: null,
  expand: false,
  overlapHeader: false,
  paddingTop: true,
  contentPadding: true,
  id: '',
};

class AppContent extends React.PureComponent {
  render() {
    const props = {
      className: 'app-content',
    };

    if (this.props.id) {
      props.id = this.props.id;
    }

    if (this.props.expand) {
      props.className += ' app-content--full';
    } else {
      props.className += ' app-content--fit';
    }

    if (this.props.overlapHeader) {
      props.className += ' app-content--with-overlap';
    }

    if (this.props.paddingTop) {
      props.className += ' app-content--with-padding-top';
    }

    if (this.props.contentPadding) {
      props.className += ' app-content--with-content-padding';
    }

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

AppContent.propTypes = propTypes;
AppContent.defaultProps = defaultProps;

export default AppContent;
