'use strict';

import React from 'react';
import { Link } from 'react-router';
import './styles';

const propTypes = {
  tags: React.PropTypes.object.isRequired,
  group: React.PropTypes.string,
  selected: React.PropTypes.string,
  tagUrl: React.PropTypes.string,
  selectedTagUrl: React.PropTypes.string,
  onClick: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.func,
  ]),
  emBase: React.PropTypes.number,
  emGain: React.PropTypes.number,
};

const defaultProps = {
  group: '',
  selected: '',
  tagUrl: '',
  selectedTagUrl: '',
  onClick: false,
  emBase: 0.7,
  emGain: 0.4,
};

class TagsCloud extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (!this.props.onClick) return;
    if (!e.target) return;

    e.preventDefault();
    e.stopPropagation();

    this.props.onClick(e.target.innerHTML, this.props.group);
  }

  processTagsSize(tags) {
    const tags_keys = Object.keys(tags);
    const tags_count = Object.keys(tags).length;
    const tags_weights = [];
    const tags_ret = [];
    let tags_weight_max = 0;

    if (!tags_count) return [];

    tags_keys.forEach((tag) => {
      const weight = tags[tag];

      tags_weights.push(weight);
      tags_weight_max = Math.max(weight, tags_weight_max);
    });

    if (tags_count > 3) {
      tags_weights.sort((a, b) => {
        return a - b;
      });

      const offset = Math.floor(tags_count * 0.85) - 1;
      tags_weight_max = tags_weights[offset];
    }

    tags_keys.forEach((tag) => {
      const weight = tags[tag];
      let size = this.props.emBase;

      if (weight > 1) {
        const c = Math.min(weight, tags_weight_max) / tags_weight_max;
        const em = this.props.emBase + (this.props.emGain * c);
        size = Math.round(em * 100) / 100;
      }

      tags_ret.push({
        tag,
        size,
      });
    });

    return tags_ret;
  }

  render() {
    const tags = this.processTagsSize(this.props.tags);

    const cloud = tags.map((tag) => {
      const props = {
        key: tag.tag,
        style: { fontSize: `${tag.size}em` },
        className: 'tags-cloud__tag',
        onClick: this.onClick,
      };

      let href = null;

      if (this.props.tagUrl) {
        href = this.props.tagUrl.replace(
          '%tag%',
          encodeURIComponent(tag.tag)
        );
      }

      if (this.props.selected === tag.tag) {
        props.className += ' tags-cloud__tag--selected';

        if (this.props.selectedTagUrl) {
          href = this.props.selectedTagUrl.replace(
            '%tag%',
            encodeURIComponent(tag.tag)
          );
        }
      }

      return (
        <li {...props}>
          <Link to={href}>{tag.tag}</Link>
        </li>
      );
    });

    return <ul className="tags-cloud">{cloud}</ul>;
  }
}

TagsCloud.propTypes = propTypes;
TagsCloud.defaultProps = defaultProps;

export default TagsCloud;
