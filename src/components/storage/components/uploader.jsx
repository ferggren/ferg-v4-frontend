'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  lang: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired,
};

class StorageUploader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_file = false;
    this.ref_drop = false;

    this.onUpload = this.onUpload.bind(this);
    this.setRefFile = this.setRefFile.bind(this);
    this.setRefDrop = this.setRefDrop.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleInput = this.toggleInput.bind(this);
  }

  componentWillUnmount() {
    this.ref_file = false;
    this.ref_drop = false;
  }

  onUpload(e) {
    e.preventDefault();

    const files = e.target.files || false;

    if (!files || !files.length) return;
    if (!this.props.onUpload) return;

    for (let i = 0; i < files.length; ++i) {
      this.props.onUpload(files[i]);
    }
  }

  onDrop(e) {
    e.preventDefault();

    const files = e.dataTransfer.files || false;

    if (this.ref_drop) {
      this.ref_drop.className = 'storage__uploader-drop';
    }

    if (!files || !files.length) return;
    if (!this.props.onUpload) return;

    for (let i = 0; i < files.length; ++i) {
      this.props.onUpload(files[i]);
    }
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDragLeave(e) {
    e.preventDefault();

    if (!this.ref_drop) return;
    this.ref_drop.className = 'storage__uploader-drop';
  }

  onDragEnter(e) {
    e.preventDefault();

    if (!this.ref_drop) return;
    this.ref_drop.className = 'storage__uploader-drop storage__uploader-drop--hover';
  }

  setRefDrop(c) {
    this.ref_drop = c;
  }

  setRefFile(c) {
    this.ref_file = c;
  }

  toggleInput() {
    if (!this.ref_file) return;
    this.ref_file.click();
  }

  makeFile() {
    const props = {
      type: 'file',
      className: 'storage__uploader-input',
      encType: 'multipart/form-data',
      ref: this.setRefFile,
      onChange: this.onUpload,
      multiple: true,
    };

    return <input {...props} />;
  }

  makeDrop() {
    const props = {
      className: 'storage__uploader-drop',
      onClick: this.toggleInput,
      ref: this.setRefDrop,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave,
      onDragEnter: this.onDragEnter,
    };

    return <div {...props}>{Lang('storage.file_upload', this.props.lang)}</div>;
  }

  render() {
    return (
      <div className="storage__uploader-wrapper">
        {this.makeFile()}
        {this.makeDrop()}
      </div>
    );
  }
}

StorageUploader.propTypes = propTypes;

export default StorageUploader;
