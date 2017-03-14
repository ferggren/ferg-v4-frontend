'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent, AppContentTitle } from 'components/app';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import ItemsGrid from 'components/items-grid';
import TagsCloud from 'components/tags-cloud';
import Paginator from 'components/paginator';
import Loader from 'components/loader';
import Lang from 'libs/lang';
import clone from 'libs/clone';
import langRu from './lang/ru';
import langEn from './lang/en';

const GALLERY_TAGS_API_KEY = 'gallery_tags';
const GALLERY_TAGS_API_URL = '/api/tags/getTags';
const GALLERY_API_KEY = 'gallery';
const GALLERY_API_URL = '/api/gallery/getPhotos';

Lang.updateLang('gallery', langRu, 'ru');
Lang.updateLang('gallery', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
  location: React.PropTypes.object.isRequired,
  photos: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]).isRequired,
  tags: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]).isRequired,
};

class FergGallery extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
    this.updateTags();
    this.updatePhotos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.updateTitle();
    }

    this.updateTags();
    this.updatePhotos();
  }

  componentWillUnmount() {
    this.props.dispatch(apiErrorDataClear(GALLERY_API_KEY));
    this.props.dispatch(apiErrorDataClear(GALLERY_TAGS_API_KEY));
  }

  updateTags() {
    const tags = this.props.tags;
    const group = 'gallery';

    if (tags && tags.options.group === group) {
      return;
    }

    this.props.dispatch(apiFetch(
      GALLERY_TAGS_API_KEY, GALLERY_TAGS_API_URL, { group, cache: true }
    ));
  }

  updatePhotos() {
    const photos = this.props.photos;
    const lang = this.props.lang;
    const query = this.props.location.query;
    const page = parseInt(query.page, 10) || 1;
    const tag = query.tag || '';

    if (photos &&
        photos.lang === lang &&
        photos.options.tag === tag &&
        photos.options.page === page
        ) {
      return;
    }

    this.props.dispatch(apiFetch(
      GALLERY_API_KEY, GALLERY_API_URL, { page, tag, cache: true }
    ));
    
    const block = document.getElementById('ferg-gallery');
    if (block) {
      const offset_top = block.offsetTop - 55;
      const window_scroll = window.scrollY;

      if (window_scroll > offset_top) {
        window.scrollTo(0, offset_top);
      }
    }
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('gallery.title')));
  }

  makeTags() {
    const tags = this.props.tags;

    if (!tags) return null;
    if (tags.loading) return <Loader />;
    if (tags.error) return tags.error;
    if (!Object.keys(tags.results).length) {
      return Lang('gallery.tags_not_found');
    }

    const url = `/${this.props.lang}/gallery/?tag=%tag%`;
    const selected_url = `/${this.props.lang}/gallery/`;

    return (
      <TagsCloud
        group={'gallery'}
        tags={tags.results}
        selected={this.props.photos ? this.props.photos.options.tag : ''}
        tagUrl={url}
        selectedTagUrl={selected_url}
      />
    );
  }

  makePhotos() {
    const photos = this.props.photos;

    if (!photos) return null;
    if (!photos.results.photos && photos.loading) return <Loader />;
    if (photos.error) return photos.error;
    if (!photos.results.photos.length) {
      return Lang('gallery.photos_not_found');
    }

    const list = clone(photos.results.photos).map((item) => {
      item.url = `/${this.props.lang}/gallery/${item.id}/`;

      if (photos.options.tag) {
        item.url += '?tag=' + encodeURIComponent(photos.options.tag);
      }

      return item;
    });

    return <ItemsGrid items={list} spacing="3" />;
  }

  makePagination() {
    const photos = this.props.photos;

    if (!photos ||
        photos.loading ||
        photos.error ||
        photos.results.pages <= 1) {
      return null;
    }

    let url = `/${this.props.lang}/gallery/?`;
    if (photos.options.tag) {
      url += `tag=${encodeURIComponent(photos.options.tag)}&`;
    }
    url += 'page=%page%';

    return (
      <AppContent>
        <Paginator
          page={photos.results.page}
          pages={photos.results.pages}
          url={url}
        />
      </AppContent>
    );
  }

  makeTitle() {
    const photos = this.props.photos;

    if (!photos.options.tag) return null;

    return (
      <AppContent expand>
        <AppContentTitle align="center">
          {photos.options.tag}
        </AppContentTitle>
      </AppContent>
    );
  }

  render() {
    return (
      <div>
        {this.makeTitle()}
        
        <AppContent id="ferg-gallery">
          {this.makePhotos()}
        </AppContent>

        {this.makePagination()}

        <AppContent>
          {this.makeTags()}
        </AppContent>
      </div>
    );
  }
}

FergGallery.propTypes = propTypes;

FergGallery.fetchData = function (store, params) {
  const state = store.getState();
  const ret = [];
  const api = state.api;

  if (!api[GALLERY_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        GALLERY_API_KEY, GALLERY_API_URL, {
          page: params.page || 1,
          tag: params.tag || '',
          cache: true,
        }
      ))
    );
  }

  if (!api[GALLERY_TAGS_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        GALLERY_TAGS_API_KEY, GALLERY_TAGS_API_URL, {
          group: 'gallery',
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang('gallery.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
    photos: state.api[GALLERY_API_KEY] || false,
    tags: state.api[GALLERY_TAGS_API_KEY] || false,
  };
})(FergGallery);
