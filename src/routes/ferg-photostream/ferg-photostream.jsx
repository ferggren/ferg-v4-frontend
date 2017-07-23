'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import PhotosMap from 'components/photos-map';
import { connect } from 'react-redux';
import { ContentWrapper, Block, BlockTitle } from 'components/ui';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import ItemsGrid from 'components/items-grid';
import TagsCloud from 'components/tags-cloud';
import { browserHistory } from 'react-router';
import Paginator from 'components/paginator';
import Loader from 'components/loader';
import Lang from 'libs/lang';
import deepClone from 'libs/deep-clone';
import langRu from './lang/ru';
import langEn from './lang/en';

const PHOTOSTREAM_TAGS_API_KEY = 'photostream_tags';
const PHOTOSTREAM_TAGS_API_URL = '/api/tags/getTags';
const PHOTOSTREAM_MARKERS_API_KEY = 'photostream_markers';
const PHOTOSTREAM_MARKERS_API_URL = '/api/photostream/getMarkers';
const PHOTOSTREAM_API_KEY = 'photostream';
const PHOTOSTREAM_API_URL = '/api/photostream/getPhotos';

Lang.updateLang('photostream', langRu, 'ru');
Lang.updateLang('photostream', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  markers: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  photos: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  tags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

class FergPhotostream extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleTagSelect = this.handleTagSelect.bind(this);
  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
    this.updateTags();
    this.updatePhotos();
    this.loadMarkers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.updateTitle();
    }

    this.updateTags();
    this.updatePhotos();
  }

  componentWillUnmount() {
    this.props.dispatch(apiErrorDataClear(PHOTOSTREAM_API_KEY));
    this.props.dispatch(apiErrorDataClear(PHOTOSTREAM_MARKERS_API_KEY));
    this.props.dispatch(apiErrorDataClear(PHOTOSTREAM_TAGS_API_KEY));
  }

  handleTagSelect(tag = false) {
    let url = `/${this.props.lang}/photostream/`;

    if (tag) {
      url += `?tag=${encodeURIComponent(tag)}`;
    }

    browserHistory.push(url);
  }

  loadMarkers() {
    if (this.props.markers) {
      return;
    }
    
    this.props.dispatch(apiFetch(
      PHOTOSTREAM_MARKERS_API_KEY, PHOTOSTREAM_MARKERS_API_URL
    ));
  }

  updateTags() {
    const tags = this.props.tags;
    const group = 'photostream';

    if (tags && tags.options.group === group) {
      return;
    }

    this.props.dispatch(apiFetch(
      PHOTOSTREAM_TAGS_API_KEY, PHOTOSTREAM_TAGS_API_URL, { group, cache: true }
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
      PHOTOSTREAM_API_KEY, PHOTOSTREAM_API_URL, { page, tag, cache: true }
    ));

    window.scrollTo(0, 0);
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('photostream.title')));
  }

  makeTags() {
    const tags = this.props.tags;

    if (!tags) return null;
    if (tags.loading) return <Loader />;
    if (tags.error) return tags.error;
    if (!Object.keys(tags.results).length) {
      return Lang('photostream.tags_not_found');
    }

    const url = `/${this.props.lang}/photostream/?tag=%tag%`;
    const selected_url = `/${this.props.lang}/photostream/`;

    return (
      <Block>
        <TagsCloud
          group={'photostream'}
          tags={tags.results}
          selected={this.props.photos ? this.props.photos.options.tag : ''}
          tagUrl={url}
          selectedTagUrl={selected_url}
        />
      </Block>
    );
  }

  makePhotos() {
    const photos = this.props.photos;

    if (!photos) return null;
    if (!photos.results.photos && photos.loading) return null;
    if (photos.error) return photos.error;
    if (!photos.results.photos.length) {
      return Lang('photostream.photos_not_found');
    }

    const list = deepClone(photos.results.photos).map((item) => {
      item.url = `/${this.props.lang}/photostream/${item.id}/`;
      item.preview = item.photo_small;

      if (photos.options.tag) {
        item.url += '?tag=' + encodeURIComponent(photos.options.tag);
      }

      return item;
    });

    return (
      <Block id="ferg-photostream">
        <ItemsGrid items={list} />
      </Block>
    );
  }

  makePagination() {
    const photos = this.props.photos;

    if (!photos ||
        photos.loading ||
        photos.error ||
        photos.results.pages <= 1) {
      return null;
    }

    let url = `/${this.props.lang}/photostream/?`;
    if (photos.options.tag) {
      url += `tag=${encodeURIComponent(photos.options.tag)}&`;
    }
    url += 'page=%page%';

    return (
      <Block>
        <Paginator
          page={photos.results.page}
          pages={photos.results.pages}
          url={url}
        />
      </Block>
    );
  }

  makeLoader() {
    if (!this.props.photos || !this.props.photos.loading) return null;

    return <Block><Loader /></Block>;
  }

  makeTitle() {
    const photos = this.props.photos;

    if (!photos.options.tag) return null;

    return (
      <Block>
        <BlockTitle align="center">
          {photos.options.tag}
        </BlockTitle>
      </Block>
    );
  }

  makePhotosMap() {
    const markers = this.props.markers;

    let photos = [];
    let loading = false;

    if (markers) {
      if (markers.loading || !markers.loaded) {
        loading = true;
      }

      if (markers.results && Array.isArray(markers.results)) {
        photos = markers.results;
      }
    }

    return (
      <PhotosMap
        lang={this.props.lang}
        tag={this.props.location.query.tag || ''}
        markers={photos}
        loading={loading}
        onTagSelect={this.handleTagSelect}
        heightSmall="40vh"
        heightFull="80vh"
      />
    );
  }

  render() {
    return (
      <div>
        <ContentWrapper navigationOverlap fullWidth>
          {this.makePhotosMap()}
        </ContentWrapper>

        <ContentWrapper>
          {this.makeTitle()}
          {this.makeLoader()}
          {this.makePhotos()}
          {this.makePagination()}
          {this.makeTags()}
        </ContentWrapper>
      </div>
    );
  }
}

FergPhotostream.propTypes = propTypes;

FergPhotostream.fetchData = function (store, params) {
  const state = store.getState();
  const ret = [];
  const api = state.api;

  if (!api[PHOTOSTREAM_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        PHOTOSTREAM_API_KEY, PHOTOSTREAM_API_URL, {
          page: parseInt(params.page, 10) || 1,
          tag: params.tag || '',
          cache: true,
        }
      ))
    );
  }

  if (!api[PHOTOSTREAM_TAGS_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        PHOTOSTREAM_TAGS_API_KEY, PHOTOSTREAM_TAGS_API_URL, {
          group: 'photostream',
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang('photostream.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
    photos: state.api[PHOTOSTREAM_API_KEY] || false,
    tags: state.api[PHOTOSTREAM_TAGS_API_KEY] || false,
    markers: state.api[PHOTOSTREAM_MARKERS_API_KEY] || false,
  };
})(FergPhotostream);
