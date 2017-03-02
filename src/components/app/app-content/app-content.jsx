'use strict';

import React from 'react';
import './styles';

const propTypes = {
  children: React.PropTypes.node,
  expand: React.PropTypes.bool,
  overlapHeader: React.PropTypes.bool,
  paddingTop: React.PropTypes.bool,
  contentPadding: React.PropTypes.bool,
};

const defaultProps = {
  children: null,
  expand: false,
  overlapHeader: false,
  paddingTop: false,
  contentPadding: true,
};

class AppContent extends React.PureComponent {
  render() {
    let content_class = 'app__content';

    if (this.props.expand) {
      content_class += ' app__content--full';
    } else {
      content_class += ' app__content--fit';
    }

    if (this.props.overlapHeader) {
      content_class += ' app__content--with-overlap';
    }

    if (this.props.paddingTop) {
      content_class += ' app__content--with-padding-top';
    }

    if (this.props.contentPadding) {
      content_class += ' app__content--with-content-padding';
    }

    return (
      <div className={content_class}>
        {this.props.children}
      </div>
    );
  }
}

AppContent.propTypes = propTypes;
AppContent.defaultProps = defaultProps;

export default AppContent;
