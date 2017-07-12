'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentWrapper, Block, BlockTitle, Grid, GridItem } from 'components/ui';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import { PhotoExposition, PhotoMeta, PhotoDetails } from 'components/photo';
import Loader from 'components/loader';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

const META_WIDTH = '240px';
const PHOTOSTREAM_PHOTO_API_URL = '/api/photostream/getPhoto';
const PHOTOSTREAM_PHOTO_API_KEY = 'photostream_photo';

Lang.updateLang('photostream-photo', langRu, 'ru');
Lang.updateLang('photostream-photo', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  photo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
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
    this.props.dispatch(apiErrorDataClear(PHOTOSTREAM_PHOTO_API_KEY));
  }

  updateTitle() {
    const photo = this.props.photo;

    if (!photo || !photo.results.info || !photo.results.info.title) {
      this.props.dispatch(titleSet(Lang('photostream-photo.title')));
      return;
    }
    
    this.props.dispatch(titleSet(Lang(
      'photostream-photo.photo-title', {
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
      PHOTOSTREAM_PHOTO_API_KEY, PHOTOSTREAM_PHOTO_API_URL, {
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
        <Block>
          <BlockTitle align="left">
            Whoops
          </BlockTitle>
        </Block>

        <Block>
          {Lang('photostream-photo.not_found')}
        </Block>
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
    return <ContentWrapper><Loader /></ContentWrapper>;
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
        <ContentWrapper navigationPadding={false} fullWidth>
          {this.makePhoto()}
        </ContentWrapper>

        <ContentWrapper>
          <Grid>
            <GridItem order="2" width={META_WIDTH}>
              {this.makeMeta()}
            </GridItem>
            <GridItem order="1" width={`calc(100% - ${META_WIDTH} - 30px)`}>
              {this.makeDesc()}
            </GridItem>
          </Grid>
        </ContentWrapper>

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

  if (!api[PHOTOSTREAM_PHOTO_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        PHOTOSTREAM_PHOTO_API_KEY, PHOTOSTREAM_PHOTO_API_URL, {
          id: parseInt(params.photo_id, 10) || 0,
          tag: params.tag || '',
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang('photostream-photo.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
    photo: state.api[PHOTOSTREAM_PHOTO_API_KEY] || false,
  };
})(FergGalleryPhoto);

