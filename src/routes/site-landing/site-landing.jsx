'use strict';

import React from 'react';
import { AppContent } from 'components/app';
import SiteHeader from 'components/site-header';
import { connect } from 'react-redux';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

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

class SiteLanding extends React.PureComponent {
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
      FEED_TAGS_API_KEY, FEED_TAGS_API_URL, { group }
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
      FEED_API_KEY, FEED_API_URL, { page, tag }
    ));
  }

  render() {
    return (
      <div>
        <AppContent expand overlapHeader paddingTop={false} contentPadding={false}>
          <SiteHeader />
        </AppContent>

        <AppContent>
          <pre
            dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.tags, null, 2) }}
          />
        </AppContent>

        <AppContent>
          <pre
            dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.feed, null, 2) }}
          />
        </AppContent>
      </div>
    );
  }
}

SiteLanding.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    feed: state.api[FEED_API_KEY] || false,
    tags: state.api[FEED_TAGS_API_KEY] || false,
  };
})(SiteLanding);
