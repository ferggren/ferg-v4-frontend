'use strict';

import React from 'react';
import { AppContent } from 'components/app';
import LandingHeader from 'components/landing-header';
import TagsCloud from 'components/tags-cloud';
import Loader from 'components/loader';
import { connect } from 'react-redux';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

const FEED_TAGS_API_KEY = 'feed_tags';
const FEED_TAGS_API_URL = '/api/tags/getTags';
const FEED_API_KEY = 'feed';
const FEED_API_URL = '/api/feed/getFeed';

Lang.updateLang('landing', langRu, 'ru');
Lang.updateLang('landing', langEn, 'en');

const propTypes = {
  lang: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  location: React.PropTypes.object.isRequired,
  feed: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]).isRequired,
  tags: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
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
  }

  makeTags() {
    const tags = this.props.tags;

    if (!tags) return null;
    if (tags.loading) return <Loader />;
    if (tags.error) return tags.error;

    const url = `/${this.props.lang}/?tag=%tag%`;
    const selected_url = `/${this.props.lang}/`;

    return (
      <TagsCloud
        group={'feed'}
        tags={tags.results}
        selected={this.props.feed ? this.props.feed.options.tag : ''}
        tagUrl={url}
        selectedTagUrl={selected_url}
      />
    );
  }

  makeFeed() {
    const feed = this.props.feed;

    if (!feed) return null;
    if (feed.loading) return <Loader />;
    if (feed.error) return feed.error;

    const html = JSON.stringify(feed, null, 2);

    return <pre dangerouslySetInnerHTML={{ __html: html }} />;
  }

  render() {
    return (
      <div>
        <AppContent expand overlapHeader paddingTop={false} contentPadding={false}>
          <LandingHeader />
        </AppContent>

        <AppContent>
          {this.makeTags()}
        </AppContent>

        <AppContent>
          {this.makeFeed()}
        </AppContent>
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
          page: params.page || 1,
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
