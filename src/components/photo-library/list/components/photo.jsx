'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import Loader from 'components/loader';

const propTypes = {
  photo: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  multiselect: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onPhotoDelete: PropTypes.func.isRequired,
  onPhotoRestore: PropTypes.func.isRequired,
  onPhotoSelect: PropTypes.func.isRequired,
  onPhotoUnselect: PropTypes.func.isRequired,
  onPhotoEdit: PropTypes.func.isRequired,
  onPhotoClick: PropTypes.func.isRequired,
};

const defaultProps = {

};

class PhotoLibraryPhoto extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onPhotoDelete = this.onPhotoDelete.bind(this);
    this.onPhotoRestore = this.onPhotoRestore.bind(this);
    this.onPhotoSelect = this.onPhotoSelect.bind(this);
    this.onPhotoUnselect = this.onPhotoUnselect.bind(this);
    this.onPhotoEdit = this.onPhotoEdit.bind(this);
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  onPhotoDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoDelete(this.props.photo);
  }

  onPhotoRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoRestore(this.props.photo);
  }

  onPhotoSelect(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoSelect(this.props.photo);
  }

  onPhotoUnselect(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoUnselect(this.props.photo);
  }

  onPhotoEdit(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoEdit(this.props.photo);
  }

  onPhotoClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPhotoClick(this.props.photo);
  }

  makeSelect() {
    const photo = this.props.photo;

    if (photo.deleted || !this.props.multiselect || this.props.selected) {
      return null;
    }

    return (
      <div
        className="photolibrary__photo-button photolibrary__photo-button-select"
        onClick={this.onPhotoSelect}
      />
    );
  }

  makeUnSelect() {
    const photo = this.props.photo;

    if (photo.deleted || !this.props.multiselect || !this.props.selected) {
      return null;
    }

    return (
      <div
        className="photolibrary__photo-button photolibrary__photo-button-unselect"
        onClick={this.onPhotoUnselect}
      />
    );
  }

  makeEdit() {
    const photo = this.props.photo;

    if (photo.loading || photo.deleted) {
      return null;
    }

    return (
      <a className="photolibrary__photo-edit" onClick={this.onPhotoEdit}>
        {Lang('photolibrary-list.photo_edit', this.props.lang)}
      </a>
    );
  }

  makeRestore() {
    const photo = this.props.photo;

    if (photo.loading || !photo.deleted) {
      return null;
    }

    return (
      <a className="photolibrary__photo-restore" onClick={this.onPhotoRestore}>
        {Lang('photolibrary-list.photo_restore', this.props.lang)}
      </a>
    );
  }

  makeRemove() {
    const photo = this.props.photo;

    if (photo.loading || photo.deleted) {
      return null;
    }

    return (
      <a className="photolibrary__photo-delete" onClick={this.onPhotoDelete}>
        {Lang('photolibrary-list.photo_delete', this.props.lang)}
      </a>
    );
  }

  makeLoader() {
    const photo = this.props.photo;

    if (!photo.loading) {
      return null;
    }

    return <div className="photolibrary__photo-loader"><Loader type="small" /></div>;
  }

  makePhotostream() {
    const photo = this.props.photo;

    if (photo.loading || !photo.photostream) {
      return null;
    }

    return <div className="photolibrary__photo-photostream" />;
  }

  render() {
    const photo = this.props.photo;

    const props = {
      onClick: this.onPhotoClick,
      className: 'photolibrary__photo',
      style: {
        backgroundImage: `url('${photo.preview}')`,
      },
    };

    if (photo.deleted) {
      props.className += ' photolibrary__photo--deleted';
    }

    return (
      <div className="photolibrary__photo-wrapper">
        <div {...props}>
          {this.makeSelect()}
          {this.makeUnSelect()}
          {this.makeEdit()}
          {this.makeRestore()}
          {this.makeRemove()}
          {this.makeLoader()}
          {this.makePhotostream()}
        </div>
      </div>
    );
  }
}

PhotoLibraryPhoto.propTypes = propTypes;
PhotoLibraryPhoto.defaultProps = defaultProps;

export default PhotoLibraryPhoto;
