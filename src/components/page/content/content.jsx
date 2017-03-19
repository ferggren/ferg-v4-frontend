'use strict';

import React from 'react';
import './styles';

const propTypes = {
  content: React.PropTypes.string.isRequired,
};

class PageContent extends React.PureComponent {
  render() {
    return (
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: this.props.content }}
      />
    );
  }
}

PageContent.propTypes = propTypes;

export default PageContent;
