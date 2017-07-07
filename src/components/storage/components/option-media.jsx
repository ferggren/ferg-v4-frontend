'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import deepClone from 'libs/deep-clone';

const propTypes = {
  lang: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  media_stats: PropTypes.object.isRequired,
  media_types: PropTypes.array.isRequired,
};

class StorageOptionMedia extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onOptionChange('media', e.target.dataset.media);
  }

  render() {
    const stats = deepClone(this.props.media_stats);
    let total = 0;

    Object.keys(stats).forEach((key) => {
      if (key === 'all') return;
      total += stats[key];
    });

    stats.all = total;

    const buttons = [];

    this.props.media_types.forEach((media) => {
      const props = {
        key: media,
        className: `storage__option storage__option--media storage__option--media-${media}`,
        onClick: this.onSelect,
        'data-media': media,
      };

      let amount = null;

      if (stats[media] && stats[media] > 0) {
        amount = <span>{stats[media]}</span>;
      }
      
      if (media === this.props.media) {
        props.className += ' storage__option--selected';
      }

      buttons.push(
        <a {...props}>
          {Lang('storage.media_' + media, this.props.lang)} {amount}
        </a>
      );
    });

    return (
      <div className="storage__options-group">
        {buttons}
      </div>
    );
  }
}

StorageOptionMedia.propTypes = propTypes;

export default StorageOptionMedia;
