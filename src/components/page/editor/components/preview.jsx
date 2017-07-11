'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import PopupWindow from 'components/popup-window';
import PhotoLibrary from 'components/photolibrary';
import Lang from 'libs/lang';

const propTypes = {
  page: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

class PageEditorPreview extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_photo_picker: false,
    };

    this.showPhotoPicker = this.showPhotoPicker.bind(this);
    this.hidePhotoPicker = this.hidePhotoPicker.bind(this);
    this.onClear = this.onClear.bind(this);
    this.selectPhoto = this.selectPhoto.bind(this);
  }

  onClear(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onSelect(0);
  }

  showPhotoPicker() {
    if (this.props.loading) {
      return;
    }

    this.setState({ show_photo_picker: true });
  }

  selectPhoto(photo) {
    this.hidePhotoPicker();
    this.props.onSelect(photo[0]);
  }

  hidePhotoPicker() {
    this.setState({ show_photo_picker: false });
  }

  makeLoader() {
    if (!this.props.loading) {
      return null;
    }

    return <div className="page-editor__preview-loader"><Loader type="small" /></div>;
  }

  makeTitle() {
    const exists = !!this.props.page.preview.small;

    return (
      <div className="page-editor__preview-title">
        <span>
          {Lang(`page-editor.${(exists ? 'update' : 'set')}_preview`, this.props.lang)}
        </span>
      </div>
    );
  }

  makeClear() {
    if (!this.props.page.preview.small) {
      return null;
    }

    return (
      <div className="page-editor__preview-clear" onClick={this.onClear}>
        {Lang('page-editor.clear_preview', this.props.lang)}
      </div>
    );
  }

  makePhotoPicker() {
    if (!this.state.show_photo_picker) {
      return null;
    }

    return (
      <PopupWindow onClose={this.hidePhotoPicker}>
        <PhotoLibrary
          onSelect={this.selectPhoto}
          lang={this.props.lang}
          multiple={false}
        />
      </PopupWindow>
    );
  }

  render() {
    const props = {
      className: 'page-editor__preview',
      style: {},
      onClick: this.showPhotoPicker,
    };

    const preview = this.props.page.preview.small;

    if (preview) {
      props.style.backgroundImage = `url('${preview}')`;
    }

    return (
      <div {...props}>
        {this.makeLoader()}
        {this.makeTitle()}
        {this.makeClear()}
        {this.makePhotoPicker()}
      </div>
    );
  }
}

PageEditorPreview.propTypes = propTypes;

export default PageEditorPreview;
