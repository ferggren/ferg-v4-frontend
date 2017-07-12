'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import PhotoLibrary from 'components/photolibrary';
import PopupWindow from 'components/popup-window';
import MediaEditorPhoto from './photo';

const propTypes = {
  lang: PropTypes.string.isRequired,
  photos: PropTypes.array.isRequired,
  onTagSelect: PropTypes.func.isRequired,
  onAttach: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
};

class MediaEditorPhotos extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_photo_picker: false,
    };

    this.showPhotoPicker = this.showPhotoPicker.bind(this);
    this.hidePhotoPicker = this.hidePhotoPicker.bind(this);
    this.onPhotosSelected = this.onPhotosSelected.bind(this);
  }

  onPhotosSelected(photos) {
    this.setState({ show_photo_picker: false });
    this.props.onAttach(photos);
  }

  showPhotoPicker() {
    this.setState({ show_photo_picker: true });
  }

  hidePhotoPicker() {
    this.setState({ show_photo_picker: false });
  }

  makePhotoPicker() {
    if (!this.state.show_photo_picker) {
      return null;
    }

    return (
      <PopupWindow onClose={this.hidePhotoPicker}>
        <PhotoLibrary
          multiple
          onSelect={this.onPhotosSelected}
          lang={this.props.lang}
        />
      </PopupWindow>
    );
  }

  makeInsertButton() {
    const props = {
      onClick: this.showPhotoPicker,
      className: 'media-editor__photo media-editor__photo--create',
      key: 'photo_create',
    };

    return (
      <div {...props}>
        <div className="media-editor__photo-add">+</div>
      </div>
    );
  }

  render() {
    const ret = [];

    this.props.photos.forEach((photo) => {
      ret.push(
        <MediaEditorPhoto
          key={photo.id}
          onTagSelect={this.props.onTagSelect}
          onDelete={this.props.onDelete}
          onRestore={this.props.onRestore}
          photo={photo}
          lang={this.props.lang}
        />
      );
    });

    ret.push(this.makeInsertButton());

    return (
      <div className="media-editor__photos">
        {this.makePhotoPicker()}
        {ret}
      </div>
    );
  }
}

MediaEditorPhotos.propTypes = propTypes;

export default MediaEditorPhotos;
