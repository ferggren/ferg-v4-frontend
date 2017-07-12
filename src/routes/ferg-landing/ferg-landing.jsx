'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { ContentWrapper, Block, BlockTitle } from 'components/ui';
import ItemsGrid from 'components/items-grid';
import TagsCloud from 'components/tags-cloud';
import Loader from 'components/loader';
import Paginator from 'components/paginator';
// import PhotosMap from 'components/photos-map';
import { connect } from 'react-redux';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import Lang from 'libs/lang';
import deepClone from 'libs/deep-clone';
import langRu from './lang/ru';
import langEn from './lang/en';

const FEED_TAGS_API_KEY = 'feed_tags';
const FEED_TAGS_API_URL = '/api/tags/getTags';
const FEED_API_KEY = 'feed';
const FEED_API_URL = '/api/feed/getFeed';

Lang.updateLang('landing', langRu, 'ru');
Lang.updateLang('landing', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  feed: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  tags: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

class FergLanding extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTags();
    this.updateFeed();
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.updateTitle();
    }

    this.updateTags();
    this.updateFeed();
  }

  componentWillUnmount() {
    this.props.dispatch(apiErrorDataClear(FEED_API_KEY));
    this.props.dispatch(apiErrorDataClear(FEED_TAGS_API_KEY));
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('landing.title')));
  }

  updateTags() {
    const tags = this.props.tags;
    const group = 'feed';

    if (tags && tags.options.group === group) {
      return;
    }

    this.props.dispatch(apiFetch(
      FEED_TAGS_API_KEY, FEED_TAGS_API_URL, { group, cache: true }
    ));
  }

  updateFeed() {
    const feed = this.props.feed;
    const lang = this.props.lang;
    const query = this.props.location.query;
    const page = parseInt(query.page, 10) || 1;
    const tag = query.tag || '';

    if (feed &&
        feed.lang === lang &&
        feed.options.tag === tag &&
        feed.options.page === page
        ) {
      return;
    }

    this.props.dispatch(apiFetch(
      FEED_API_KEY, FEED_API_URL, { page, tag, cache: true }
    ));

    const block = document.getElementById('ferg-feed');
    if (block) {
      const offset_top = block.offsetTop - 55;
      const window_scroll = window.scrollY;

      if (window_scroll > offset_top) {
        window.scrollTo(0, offset_top);
      }
    }
  }

  makeTags() {
    const tags = this.props.tags;

    if (!tags) return null;
    if (tags.loading) return <Loader />;
    if (tags.error) return tags.error;
    if (!Object.keys(tags.results).length) {
      return Lang('landing.tags_not_found');
    }

    const url = `/${this.props.lang}/?tag=%tag%`;
    const selected_url = `/${this.props.lang}/`;

    return (
      <Block>
        <TagsCloud
          group={'feed'}
          tags={tags.results}
          selected={this.props.feed ? this.props.feed.options.tag : ''}
          tagUrl={url}
          selectedTagUrl={selected_url}
        />
      </Block>
    );
  }

  makeFeed() {
    const feed = this.props.feed;

    if (!feed) return null;
    if (!feed.results.list && feed.loading) return null;
    if (feed.error) return feed.error;
    if (!feed.results.list.length) {
      return Lang('landing.feed_not_found');
    }

    let list = feed.results.list;

    if (feed.options.tag) {
      list = deepClone(list).map((item) => {
        if (item.type === 'photostream') {
          item.url += '?tag=' + encodeURIComponent(feed.options.tag);
        }

        return item;
      });
    }

    return (
      <Block id="ferg-feed">
        <ItemsGrid items={list} spacing="10" maxRatio={5} />
      </Block>
    );
  }

  makeLoader() {
    if (!this.props.feed || !this.props.feed.loading) return null;
    return <Block><Loader /></Block>;
  }

  makeTitle() {
    const feed = this.props.feed;

    if (!feed.options.tag) return null;

    return (
      <Block>
        <BlockTitle align="left">
          {feed.options.tag}
        </BlockTitle>
      </Block>
    );
  }

  makePagination() {
    const feed = this.props.feed;

    if (!feed ||
        feed.loading ||
        feed.error ||
        feed.results.pages <= 1) {
      return null;
    }

    let url = `/${this.props.lang}/?`;
    if (feed.options.tag) {
      url += `tag=${encodeURIComponent(feed.options.tag)}&`;
    }
    url += 'page=%page%';

    return (
      <Block>
        <Paginator
          page={feed.results.page}
          pages={feed.results.pages}
          url={url}
        />
      </Block>
    );
  }

  render() {
    return (
      <div>
        {/* <ContentWrapper navigationOverlap fullWidth>
          <PhotosMap
            lang={this.props.lang}
            photos={[]}
            heightSmall="40vh"
            heightFull="100vh"
          />
        </ContentWrapper> */}

        <ContentWrapper>
          {this.makeTitle()}
          {this.makeLoader()}
          {this.makeFeed()}
          {this.makePagination()}
          {this.makeTags()}
        </ContentWrapper>
      </div>
    );
  }
}

FergLanding.propTypes = propTypes;

FergLanding.fetchData = function (store, params) {
  const state = store.getState();
  const api = state.api;
  const ret = [];

  if (!api[FEED_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        FEED_API_KEY, FEED_API_URL, {
          page: parseInt(params.page, 10) || 1,
          tag: params.tag || '',
          cache: true,
        }
      ))
    );
  }

  if (!api[FEED_TAGS_API_KEY]) {
    ret.push(
      store.dispatch(apiFetch(
        FEED_TAGS_API_KEY, FEED_TAGS_API_URL, {
          group: 'feed',
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang('landing.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
    feed: state.api[FEED_API_KEY] || false,
    tags: state.api[FEED_TAGS_API_KEY] || false,
  };
})(FergLanding);
