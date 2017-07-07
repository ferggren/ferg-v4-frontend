'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import Loader from 'components/loader';
import { niceTimeFormat } from 'libs/nice-time';

const propTypes = {
  file: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onFileRestore: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  onFileDelete: PropTypes.func.isRequired,
};

class StorageFile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRestore = this.onRestore.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onFileRestore(this.props.file);
  }

  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onFileDelete(this.props.file);
  }

  onSelect(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onFileSelect(this.props.file);
  }

  niceDownloads(downloads) {
    if (downloads <= 0) {
      return Lang('storage.file_not_downloaded', this.props.lang);
    }
    
    return Lang('storage.file_downloads', { downloads }, this.props.lang);
  }

  niceUploadedTime(time) {
    return niceTimeFormat(time);
  }

  niceSize(size) {
    const sizes = [
      'byte',
      'kilobyte',
      'megabyte',
      'gigabyte',
    ];

    for (let i = 0; i < sizes.length; ++i) {
      if (size > 1024) {
        size /= 1024;
        continue;
      }

      size = (Math.round(size * 100) / 100);
      return Lang('storage.size_' + sizes[i], { size }, this.props.lang);
    }

    size = (Math.round(size * 100) / 100);
    return Lang('storage.size_' + sizes[sizes.length - 1], { size }, this.props.lang);
  }

  makeIco() {
    const file = this.props.file;

    if (file.preview && file.link_preview) return null;

    return <div className={`storage__file-ico storage__file-ico--${file.media}`} />;
  }

  makePreview() {
    const file = this.props.file;

    if (!file.preview || !file.link_preview) return null;

    const props = {
      className: 'storage__file-preview',
      style: {
        backgroundImage: `url(${file.link_preview})`,
      },
    };

    return <div {...props} />;
  }

  makeLoader() {
    if (!this.props.file.loading) return null;
    return <div className="storage__file-loader"><Loader type="small" /></div>;
  }

  makeRemove() {
    if (this.props.file.loading) return null;
    if (this.props.file.file_deleted) return null;

    return (
      <a className="storage__file-delete" onClick={this.onDelete}>
        {Lang('storage.file_delete', this.props.lang)}
      </a>
    );
  }

  makeRestore() {
    if (this.props.file.loading) return null;
    if (!this.props.file.file_deleted) return null;

    return (
      <a className="storage__file-restore" onClick={this.onRestore}>
        {Lang('storage.file_restore', this.props.lang)}
      </a>
    );
  }

  render() {
    const file = this.props.file;
    let className = 'storage__file-wrapper';

    if (file.file_deleted) {
      className += ' storage__file-wrapper--deleted';
    }

    return (
      <div className={className} onClick={this.onSelect}>
        {this.makePreview()}
        {this.makeIco()}

        <div className="storage__file-title">
          <a href={file.link_download} target="_blank" rel="noopener noreferrer">
            {file.name}
          </a>
        </div>

        {this.makeRemove()}
        {this.makeRestore()}
        {this.makeLoader()}

        <div className="storage__file-info">
          <span className="storage__file-date">
            {this.niceUploadedTime(file.uploaded)}
          </span>
          <span className="storage__file-size">
            , {this.niceSize(file.size)}
          </span>
          <span className="storage__file-downloads">
            {this.niceDownloads(file.downloads)}
          </span>
        </div>
      </div>
    );
  }
}

StorageFile.propTypes = propTypes;

export default StorageFile;
