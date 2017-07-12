'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import Lang from 'libs/lang';

const propTypes = {
  lang: PropTypes.string.isRequired,
  photo: PropTypes.object.isRequired,
  onTagSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
};

class MediaEditorLangs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_tags: false,
    };

    this.onRestore = this.onRestore.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.showTags = this.showTags.bind(this);
    this.hideTags = this.hideTags.bind(this);
    this.toggleTags = this.toggleTags.bind(this);
    this.insertTag = this.insertTag.bind(this);
  }

  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onDelete(this.props.photo);
  }

  onRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onRestore(this.props.photo);
  }

  insertTag(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.dataset.tag) {
      return;
    }

    const photo = this.props.photo;
    const tag = e.target.dataset.tag;
    const insert = `<${tag} id=${photo.id} file="${photo.name}" desc="" />`;

    this.setState({ show_tags: false });
    this.props.onTagSelect(insert);
  }

  showTags() {
    this.setState({ show_tags: true });
  }

  hideTags() {
    this.setState({ show_tags: false });
  }

  toggleTags() {
    this.setState({ show_tags: !this.state.show_tags });
  }

  makeButtons() {
    const photo = this.props.photo;

    if (!this.state.show_tags || photo.loading || photo.deleted) {
      return null;
    }

    const buttons = [
      { name: 'IMG', tag: 'PhotoBig' },
      { name: 'img', tag: 'PhotoSmall' },
      { name: '<', tag: 'PhotoLeft' },
      { name: '>', tag: 'PhotoRight' },
      { name: '-', tag: 'PhotoGrid' },
      { name: 'pl', tag: 'PhotoParallax' },
    ];

    const ret = [];

    buttons.forEach((button) => {
      const props = {
        key: button.tag,
        onClick: this.insertTag,
        className: 'media-editor__photo-button media-editor__photo-tag',
        'data-tag': button.tag,
      };

      ret.push(
        <div {...props}>
          {button.name}
        </div>
      );
    });

    return (
      <div className="media-editor__photo-tags">
        {ret}
      </div>
    );
  }

  makeName() {
    return (
      <div className="media-editor__photo-button media-editor__photo-button--title">
        {this.props.photo.name}
      </div>
    );
  }

  makeRemove() {
    const photo = this.props.photo;

    if (photo.loading || photo.deleted) {
      return null;
    }

    return (
      <div
        className="media-editor__photo-button media-editor__photo-button--delete"
        onClick={this.onDelete}
      >
        {Lang('media-editor.photo_delete', this.props.lang)}
      </div>
    );
  }

  makeRestore() {
    const photo = this.props.photo;

    if (photo.loading || !photo.deleted) {
      return null;
    }

    return (
      <div
        className="media-editor__photo-button media-editor__photo-button--restore"
        onClick={this.onRestore}
      >
        {Lang('media-editor.photo_restore', this.props.lang)}
      </div>
    );
  }

  makeLoader() {
    if (!this.props.photo.loading) {
      return null;
    }

    return <div className="media-editor__photo-loader"><Loader type="small" /></div>;
  }

  render() {
    const props = {
      onMouseLeave: this.hideTags,
      onMouseEnter: this.showTags,
      onClick: this.toggleTags,
      className: 'media-editor__photo',
      style: {
        backgroundImage: `url('${this.props.photo.preview}')`,
      },
    };

    return (
      <div {...props}>
        {this.makeButtons()}
        {this.makeName()}
        {this.makeRemove()}
        {this.makeRestore()}
        {this.makeLoader()}
      </div>
    );
  }
}

MediaEditorLangs.propTypes = propTypes;

export default MediaEditorLangs;
