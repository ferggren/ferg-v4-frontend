'use strict';

import React from 'react';
import TagsCloud from 'components/tags-cloud';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import PhotoLibrarySeparator from './separator';

const propTypes = {
  onTagSelect: PropTypes.func.isRequired,
  tags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  selected: PropTypes.object.isRequired,
};

const defaultProps = {

};

class PhotoLibraryTags extends React.PureComponent {
  render() {
    if (this.props.tags === false) {
      return <Loader />;
    }

    const clouds = [];

    const tags = [
      'camera',
      'lens',
      'iso',
      'aperture',
      'shutter_speed',
      'category',
      'fl',
      'efl',
      'location',
    ];

    tags.forEach((tag) => {
      if (!this.props.tags[tag] || !Object.keys(this.props.tags[tag]).length) {
        return;
      }

      if (clouds.length) {
        clouds.push(<PhotoLibrarySeparator key={`${tag}_spacing`} />);
      }

      clouds.push(
        <TagsCloud
          key={`${tag}_cloud`}
          group={tag}
          tags={this.props.tags[tag]}
          selected={this.props.selected[tag]}
          onSelect={this.props.onTagSelect}
        />
      );
    });

    return (
      <div>
        {clouds}
      </div>
    );
  }
}

PhotoLibraryTags.propTypes = propTypes;
PhotoLibraryTags.defaultProps = defaultProps;

export default PhotoLibraryTags;
