'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent, AppContentTitle, AppGrid, AppGridItem } from 'components/app';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import { PhotoExposition, PhotoMeta, PhotoDetails } from 'components/photo';
import Loader from 'components/loader';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

const GALLERY_PHOTO_API_URL = '/api/gallery/getPhoto';
const GALLERY_PHOTO_API_KEY = 'gallery_photo';

Lang.updateLang('gallery-photo', langRu, 'ru');
Lang.updateLang('gallery-photo', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  photo: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]).isRequired,
};

class FergGalleryPhoto extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
    this.updatePhoto();
  }

  componentDidUpdate() {
    this.updateTitle();
    this.updatePhoto();
  }

  componentWillUnmount() {
    this.props.dispatch(apiErrorDataClear(GALLERY_PHOTO_API_KEY));
  }

  updateTitle() {
    const photo = this.props.photo;

    if (!photo || !photo.results.info || !photo.results.info.title) {
      this.props.dispatch(titleSet(Lang('gallery-photo.title')));
      return;
    }
    
    this.props.dispatch(titleSet(Lang(
      'gallery-photo.photo-title', {
        title: photo.results.info.title,
      }
    )));
  }

  updatePhoto() {
    const photo = this.props.photo;
    const lang = this.props.lang;
    const query = this.props.location.query;
    const id = parseInt(this.props.params.photo_id, 10) || 0;
    const tag = query.tag || '';

    if (photo &&
        photo.lang === lang &&
        photo.options.id === id &&
        photo.options.tag === tag
        ) {
      return;
    }

    this.props.dispatch(apiFetch(
      GALLERY_PHOTO_API_KEY, GALLERY_PHOTO_API_URL, {
        id,
        tag,
        cache: true,
      }
    ));
    
    const block = document.getElementById('ferg-photo');
    if (block) {
      const offset_top = block.offsetTop - 55;
      const window_scroll = window.scrollY;

      if (window_scroll > offset_top) {
        window.scrollTo(0, offset_top);
      }
    }
  }

  makeError() {
    return (
      <div>
        <AppContent>
          <AppContentTitle align="left">
            Whoops
          </AppContentTitle>
        </AppContent>

        <AppContent>
          {Lang('gallery-photo.not_found')}
        </AppContent>
      </div>
    );
  }

  makeDesc() {
    const photo = this.props.photo.results;
    const info = photo.info || false;

    if (!info) return null;

    return <PhotoDetails photo={info} lang={this.props.lang} />;
  }

  makeMeta() {
    const photo = this.props.photo.results;
    const info = photo.info || false;

    if (!info) return null;

    return <PhotoMeta photo={info} lang={this.props.lang} />;
  }

  makePhoto() {
    const photo = this.props.photo.results;
    const info = photo.info || false;
    const next = photo.next || false;
    const prev = photo.prev || false;

    return (
      <PhotoExposition
        lang={this.props.lang}
        photo={info}
        next={next}
        prev={prev}
        tag={this.props.photo.options.tag}
      />
    );
  }

  makeLoader() {
    if (!this.props.photo || !this.props.photo.loading) return null;

    return (
      <AppContent>
        <Loader />
      </AppContent>
    );
  }

  render() {
    const photo = this.props.photo;

    if (photo === false) {
      return this.makeLoader();
    }

    if (photo && photo.error) {
      return this.makeError();
    }

    return (
      <div>
        <AppContent expand paddingTop={false} contentPadding={false}>
          {this.makePhoto()}
        </AppContent>

        <AppContent paddingTop={false} contentPadding={false}>
          <AppGrid direction="row">
            <AppGridItem order="1" width="70%">
              {this.makeDesc()}
            </AppGridItem>
            <AppGridItem order="2" width="30%">
              {this.makeMeta()}
            </AppGridItem>
          </AppGrid>
        </AppContent>

        {this.makeLoader()}
      </div>
    );
  }
}

FergGalleryPhoto.propTypes = propTypes;

FergGalleryPhoto.fetchData = function (store, params) {
  const state = store.getState();
  const ret = [];
  const api = state.api;

  if (!api[GALLERY_PHOTO_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        GALLERY_PHOTO_API_KEY, GALLERY_PHOTO_API_URL, {
          id: parseInt(params.photo_id, 10) || 0,
          tag: params.tag || '',
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang('gallery-photo.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
    photo: state.api[GALLERY_PHOTO_API_KEY] || false,
  };
})(FergGalleryPhoto);

