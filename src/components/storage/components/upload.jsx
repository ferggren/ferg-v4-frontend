'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  upload: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onUploadClick: PropTypes.func.isRequired,
};

class StorageUpload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onUploadClick(this.props.upload);
  }

  makeTitle() {
    let title = this.props.upload.file_name || false;

    if (!title) {
      title = Lang('storage.upload_file_placeholder', this.props.lang);
    }

    return <div className="storage__upload-title"><span>{title}</span></div>;
  }

  render() {
    const upload = this.props.upload;

    let progress = 0;
    let status = null;
    let progressClass = 'storage__upload-progress';

    switch (upload.status) {
      case 'scheduled': {
        progress = 0;
        status = Lang('storage.upload_file_scheduled', this.props.lang);
        break;
      }

      case 'uploading': {
        progress = this.props.upload.progress;
        status = Lang('storage.upload_file_uploading', this.props.lang);
        status += ' (' + progress + '%)';
        break;
      }

      case 'success': {
        progress = 100;
        status = Lang('storage.upload_file_success', this.props.lang);
        break;
      }

      case 'error': {
        progress = 100;
        status = upload.error || Lang('storage.error_file_upload_error', this.props.lang);
        progressClass += ' storage__upload-progress--error';
        break;
      }

      default: {
        break;
      }
    }
    
    return (
      <div className="storage__upload" onClick={this.onClick}>
        <div className={progressClass} style={{ width: `${progress}%` }} />
        {this.makeTitle()}
        <div className="storage__upload-status">{status}</div>
      </div>
    );
  }
}

StorageUpload.propTypes = propTypes;

export default StorageUpload;
