'use strict';

import React from 'react';
import './styles';

const propTypes = {
  content: React.PropTypes.string.isRequired,
};

class PageContent extends React.PureComponent {
  render() {
    console.log(this.props);
    return null;
  }
}

PageContent.propTypes = propTypes;

export default PageContent;
