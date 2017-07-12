'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import Request from 'libs/request';
import {
  Grid,
  GridItem,
  Block,
  FormCallout,
  FormButton,
  FormInputText,
  FormInputSelect,
} from 'components/ui';
import Loader from 'components/loader';
import PopupWindow from 'components/popup-window';
import deepClone from 'libs/deep-clone';
import MediaEditorContent from 'components/media/content';
import MediaEditorLangs from './components/langs';
import MediaEditorPhotos from './components/photos';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

const PHOTOS_WIDTH = '240px';

Lang.updateLang('media-editor', langRu, 'ru');
Lang.updateLang('media-editor', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  entry_key: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  langs: PropTypes.array.isRequired,
};

class MediaEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    let langs = this.props.langs;
    if (typeof langs === 'string') {
      langs = langs.split(',');
    }

    this.state = {
      preview: false,
      entry: false,
      entry_lang: langs[0],
      entry_langs: langs,
      photos: false,
      error: false,
      loading: false,
    };

    this.requests = {};
    this.fieldsRefs = {};

    this.loadEntry = this.loadEntry.bind(this);
    this.loadPhotos = this.loadPhotos.bind(this);
    this.insertTag = this.insertTag.bind(this);
    this.setRef = this.setRef.bind(this);
    this.makeIndent = this.makeIndent.bind(this);
    this.addPhotos = this.addPhotos.bind(this);
    this.restorePhoto = this.restorePhoto.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.updateEntry = this.updateEntry.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.onTextKeyDown = this.onTextKeyDown.bind(this);
  }

  componentDidMount() {
    this.loadEntry();
    this.loadPhotos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.entry_key !== this.props.entry_key) {
      this.loadEntry();
      this.loadPhotos();
    }
  }

  componentWillUnmount() {
    Object.keys(this.requests).forEach((request) => {
      if (!this.requests[request]) {
        return;
      }

      Request.abort(this.requests[request]);
    });

    this.requests = {};
    this.fieldsRefs = {};
    this.fieldsRefs.text = false;
  }

  onTextKeyDown(e) {
    if (e.keyCode === 9 && this.insertTag('  ')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (e.keyCode === 13 && this.makeIndent()) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  setRef(c, name) {
    this.fieldsRefs[name] = c;
  }

  loadEntry() {
    this.setState({
      entry: false,
      error: false,
      loading: true,
    });

    if (this.requests.entry) {
      Request.abort(this.requests.entry);
    }

    this.requests.entry = Request.fetch(
      '/api/media/getEntry/', {
        method: 'POST',

        success: (entry) => {
          this.requests.entry = null;
          this.setState({ entry, loading: false });
        },

        error: (error) => {
          this.requests.entry = null;

          this.setState({
            loading: false,
            error: Lang(`media-editor.error_${error}`, this.props.lang),
          });
        },

        data: {
          key: this.props.entry_key,
          lang: this.state.entry_lang,
        },
      }
    );
  }

  loadPhotos() {
    this.setState({ photos: false });

    if (this.requests.photos) {
      Request.abort(this.requests.photos);
    }

    this.requests.photos = Request.fetch(
      '/api/media/getPhotos/', {
        method: 'POST',

        success: (photos) => {
          this.requests.photos = null;
          this.setState({ photos });
        },

        error: (error) => {
          this.requests.photos = null;

          this.setState({
            loading: false,
            error: Lang(`media-editor.error_${error}`, this.props.lang),
          });
        },

        data: {          
          key: this.props.entry_key,
        },
      }
    );
  }

  insertTag(tag_start, tag_end) {
    tag_start = tag_start || '';
    tag_end = tag_end || '';

    if (this.state.loading) {
      return false;
    }

    if (!this.fieldsRefs.text) {
      return false;
    }

    let text = this.fieldsRefs.text.value;
    let select_start = this.fieldsRefs.text.selectionStart;
    let select_end = this.fieldsRefs.text.selectionEnd;

    if (isNaN(select_start)) {
      select_start = text.length;
      select_end = text.length;
    }

    if (!tag_end) {
      text = text.substring(0, select_start) + tag_start + text.substring(select_end, text.length);
    } else {
      text = text.substring(0, select_end) + tag_end + text.substring(select_end, text.length);
      text = text.substring(0, select_start) + tag_start + text.substring(select_start, text.length);
    }

    this.fieldsRefs.text.value = text;

    if (this.fieldsRefs.text.setSelectionRange) {
      if (!tag_end) {
        this.fieldsRefs.text.setSelectionRange(
          select_start + tag_start.length,
          select_start + tag_start.length
        );
      } else {
        this.fieldsRefs.text.setSelectionRange(
          select_end + tag_start.length + tag_end.length,
          select_end + tag_start.length + tag_end.length
        );
      }
    }

    return true;
  }

  makeIndent() {
    if (this.state.loading) {
      return false;
    }

    if (!this.fieldsRefs.text) {
      return false;
    }

    const text = this.fieldsRefs.text.value;
    const select_start = this.fieldsRefs.text.selectionStart;

    if (isNaN(select_start)) {
      return false;
    }

    let indents = 0;
    let position = select_start;

    /* eslint-disable quotes */

    while (--position >= 0) {
      const char = text.charAt(position);

      if (char === "\r" || char === "\n") {
        break;
      }

      if (char !== ' ') {
        indents = 0;
        continue;
      }

      ++indents;
    }

    if (!indents) {
      return false;
    }

    this.insertTag("\n" + (new Array(indents + 1).join(' ')));

    /* eslint-enable quotes */

    return true;
  }

  addPhotos(photos_add) {
    this.setState({ photos: false });

    if (this.requests.add_photos) {
      Request.abort(this.requests.add_photos);
    }

    this.requests.add_photos = Request.fetch(
      '/api/media/addPhotos/', {
        method: 'POST',

        success: (photos) => {
          this.requests.add_photos = null;
          this.setState({ photos });
        },

        error: () => {
          this.requests.add_photos = null;
          this.loadPhotos();
        },

        data: {
          key: this.props.entry_key,
          photos: photos_add.join(','),
        },
      }
    );
  }

  deletePhoto(photo_deleted) {
    const photos = deepClone(this.state.photos);
    const photo = photos.find((e) => { return e.id === photo_deleted.id; });
    const key = `photo_${photo_deleted.id}`;

    if (!photo) {
      return;
    }

    photo.loading = true;
    this.setState({ photos });

    if (this.requests[key]) {
      Request.abort(this.requests[key]);
    }

    this._requests[key] = Request.fetch(
      '/api/media/deletePhoto/', {
        method: 'POST',

        success: () => {
          this.requests[key] = null;

          const photos_edited = deepClone(this.state.photos);
          const photo_edited = photos_edited.find((e) => { return e.id === photo_deleted.id; });

          if (photo_edited) {
            photo_edited.deleted = true;
            photo_edited.loading = false;
          }

          this.setState({ photos: photos_edited });
        },

        error: () => {
          this.requests[key] = null;

          const photos_edited = deepClone(this.state.photos);
          const photo_edited = photos_edited.find((e) => { return e.id === photo_deleted.id; });

          if (photo_edited) {
            photo_edited.loading = false;
          }

          this.setState({ photos: photos_edited });
        },

        data: {
          key: this.props.entry_key,
          photo_id: photo_deleted.id,
        },
      }
    );
  }

  restorePhoto(photo) {
    this.addPhotos([photo.id]);
  }

  changeLang(lang) {
    if (this.state.loading) {
      return;
    }

    if (this.state.entry_lang === lang) {
      return;
    }

    this.setState({ entry_lang: lang }, this.loadEntry);
  }

  updateEntry() {
    if (!this.fieldsRefs.text) {
      return;
    }

    const select = this.fieldsRefs.visible;
    const visible = select.options[select.selectedIndex].value;

    const entry = {
      title: this.fieldsRefs.title.value || '',
      desc: this.fieldsRefs.desc.value || '',
      text: this.fieldsRefs.text.value || '',
      visible: visible === 'visible',
    };

    this.setState({ loading: true, error: false });

    if (this.requests.update_entry) {
      Request.abort(this.requests.update_entry);
    }

    this.requests.update_entry = Request.fetch(
      '/api/media/updateEntry/', {
        method: 'POST',

        success: () => {
          this.requests.update_entry = null;
          this.setState({ loading: false, entry });

          if (this.props.onUpdate) {
            this.props.onUpdate();
          }
        },

        error: (error) => {
          this.requests.update_entry = null;

          this.setState({
            loading: false,
            error: Lang(`media-editor.error_${error}`, this.props.lang),
          });
        },

        data: {
          key: this.props.entry_key,
          lang: this.state.entry_lang,
          title: entry.title,
          desc: entry.desc,
          text: entry.text,
          visible: entry.visible ? 'visible' : 'hidden',
        },
      }
    );
  }

  showPreview() {
    if (!this.fieldsRefs.text) {
      return;
    }

    this.setState({ loading: true, error: false });

    if (this.requests.preview_entry) {
      Request.abort(this.requests.preview_entry);
    }

    this.requests.preview_entry = Request.fetch(
      '/api/media/getPreview/', {
        method: 'POST',

        success: (html) => {
          this.requests.preview_entry = null;

          this.setState({
            loading: false,
            preview: html,
          });
        },

        error: (error) => {
          this.requests.preview_entry = null;

          this.setState({
            loading: false,
            error: Lang(`media-editor.error_${error}`, this.props.lang),
          });
        },

        data: {
          text: this.fieldsRefs.text.value,
        },
      }
    );
  }

  closePreview() {
    this.setState({ preview: false });
  }

  makeLangs() {
    return (
      <Block>
        <MediaEditorLangs
          entry_langs={this.state.entry_langs}
          entry_lang={this.state.entry_lang}
          lang={this.props.lang}
          onSelect={this.changeLang}
        />
      </Block>
    );
  }

  makePreview() {
    if (!this.state.preview) {
      return null;
    }

    return (
      <PopupWindow onClose={this.closePreview}>
        <MediaEditorContent content={this.state.preview} />
      </PopupWindow>
    );
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return <Block><FormCallout>{this.state.error}</FormCallout></Block>;
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Block><Loader /></Block>;
  }

  makeEditor() {
    return (
      <Block>
        <Block>
          <FormInputSelect
            name="visible"
            setRef={this.setRef}
            value={this.state.entry.visible ? 'visible' : 'hidden'}
            onChange={this.updateEntry}
            values={[
              { text: Lang('media-editor.entry_hidden', this.props.lang), value: 'hidden' },
              { text: Lang('media-editor.entry_visible', this.props.lang), value: 'visible' },
            ]}
          />
        </Block>

        <Block>
          <FormInputText
            name="title"
            setRef={this.setRef}
            defaultValue={this.state.entry.title || ''}
            placeholder={Lang('media-editor.entry_title', this.props.lang)}
            disabled={this.state.loading}
            onSubmit={this.updateEntry}
          />
        </Block>
        
        <Block>
          <FormInputText
            name="desc"
            setRef={this.setRef}
            defaultValue={this.state.entry.desc || ''}
            placeholder={Lang('media-editor.entry_desc', this.props.lang)}
            disabled={this.state.loading}
            onSubmit={this.updateEntry}
          />
        </Block>
        
        <Block>
          <FormInputText
            name="text"
            setRef={this.setRef}
            defaultValue={this.state.entry.text || ''}
            placeholder={Lang('media-editor.entry_text', this.props.lang)}
            disabled={this.state.loading}
            onSubmit={this.updateEntry}
            onKeyDown={this.onTextKeyDown}
            multiline
          />
        </Block>
      </Block>
    );
  }

  makeButtons() {
    if (this.state.loading) {
      return null;
    }

    return (
      <Block>
        <Grid justifyContent="space-between">
          <GridItem width="49%">
            <FormButton onClick={this.updateEntry} disabled={this.state.loading}>
              {Lang('media-editor.update_entry', this.props.lang)}
            </FormButton>
          </GridItem>
          
          <GridItem width="49%">
            <FormButton onClick={this.showPreview} disabled={this.state.loading}>
              {Lang('media-editor.show_preview', this.props.lang)}
            </FormButton>
          </GridItem>
        </Grid>
      </Block>
    );
  }

  makePhotos() {
    if (this.state.photos === false) {
      return <Block><Loader /></Block>;
    }

    return (
      <Block>
        <MediaEditorPhotos
          photos={this.state.photos}
          lang={this.props.lang}
          onTagSelect={this.insertTag}
          onAttach={this.addPhotos}
          onDelete={this.deletePhoto}
          onRestore={this.restorePhoto}
        />
      </Block>
    );
  }

  render() {
    if (!this.state.entry) {
      if (this.state.loading) {
        return <div className="media-editor"><Loader /></div>;
      }

      return (
        <div className="media-editor">
          <FormCallout>
            {Lang('media-editor.not_found', this.props.lang)}
          </FormCallout>
        </div>
      );
    }

    return (
      <div className="media-editor">
        {this.makeLangs()}
        {this.makePreview()}

        <Grid justifyContent="space-between">
          <GridItem width={`calc(100% - ${PHOTOS_WIDTH} - 30px)`}>
            {this.makeError()}
            {this.makeEditor()}
            {this.makeLoader()}
            {this.makeButtons()}
          </GridItem>

          <GridItem width={PHOTOS_WIDTH}>
            {this.makePhotos()}
          </GridItem>
        </Grid>

        <div className="floating-clear" />
      </div>
    );
  }
}

MediaEditor.propTypes = propTypes;

export default MediaEditor;
