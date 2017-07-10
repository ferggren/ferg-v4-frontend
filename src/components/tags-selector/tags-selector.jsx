'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  tag: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  multiple: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

const defaultProps = {
  multiple: false,
};

class TagsSelector extends React.PureComponent {
  render() {
    console.log(this.props);
    return <div>TagsSelector</div>;
  }
}

TagsSelector.propTypes = propTypes;
TagsSelector.defaultProps = defaultProps;

export default TagsSelector;
