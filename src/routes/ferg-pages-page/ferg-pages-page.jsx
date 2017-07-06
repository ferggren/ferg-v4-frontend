'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppContent, AppContentTitle } from 'components/app';
import { PageHeader, PageContent } from 'components/page';
import { titleSet } from 'actions/title';
import { apiFetch, apiErrorDataClear } from 'actions/api';
import Loader from 'components/loader';
import TagsCloud from 'components/tags-cloud';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

const PAGE_API_URL = '/api/pages/getPage';
const PAGE_API_KEY = {
  blog: 'page_blog',
  events: 'page_events',
};

Lang.updateLang('page', langRu, 'ru');
Lang.updateLang('page', langEn, 'en');

function getPagesType(location) {
  const match = location.match(/^\/(?:en\/|ru\/)?(blog|events)\//);

  if (!match) return 'blog';
  return match[1];
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  page: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

class FergBlogPage extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
    this.updatePage();
  }

  componentDidUpdate() {
    this.updateTitle();
    this.updatePage();
  }

  componentWillUnmount() {
    this.props.dispatch(apiErrorDataClear(
      PAGE_API_KEY[this.props.type]
    ));
  }

  updateTitle() {
    const page = this.props.page;

    if (!page || !page.results.title) {
      this.props.dispatch(titleSet(Lang(`page.${this.props.type}-title`)));
      return;
    }
    
    this.props.dispatch(titleSet(Lang(
      `page.${this.props.type}-page-title`, {
        title: page.results.title,
      }
    )));
  }

  updatePage() {
    const page = this.props.page;
    const type = this.props.type;
    const lang = this.props.lang;
    const id = parseInt(this.props.params.page_id, 10) || 0;

    if (page &&
        page.lang === lang &&
        page.options.type === type &&
        page.options.id === id
        ) {
      return;
    }

    this.props.dispatch(apiFetch(
      PAGE_API_KEY[type], PAGE_API_URL, {
        id,
        type,
        cache: true,
      }
    ));
    
    const block = document.getElementById('ferg-page');
    if (block) {
      const offset_top = block.offsetTop - 55;
      const window_scroll = window.scrollY;

      if (window_scroll > offset_top) {
        window.scrollTo(0, offset_top);
      }
    }
  }

  makeLoader() {
    return (
      <AppContent>
        <Loader />
      </AppContent>
    );
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
          {Lang('page.not_found')}
        </AppContent>
      </div>
    );
  }

  makeHeader() {
    return (
      <AppContent expand overlapHeader paddingTop={false} contentPadding={false}>
        <PageHeader page={this.props.page.results} />
      </AppContent>
    );
  }

  makeContent() {
    const page = this.props.page.results;

    if (!page.html) {
      return (
        <AppContent>
          {Lang('page.page_is_empty')}
        </AppContent>
      );
    }

    return (
      <AppContent>
        <PageContent content={page.html} />
      </AppContent>
    );
  }

  makeTags() {
    const page = this.props.page.results;

    if (!page.tags) return null;

    const tags = {};

    page.tags.split(',').forEach((tag) => {
      tag = tag.trim();
      if (tag) tags[tag] = 1;
    });

    return (
      <TagsCloud
        group={this.props.type}
        tags={tags}
        tagUrl={`/${this.props.lang}/${this.props.type}/?tag=%tag%`}
      />
    );
  }

  render() {
    const page = this.props.page;

    if (!page || page.loading) {
      return this.makeLoader();
    }

    if (page.error) {
      return this.makeError();
    }

    return (
      <div>
        {this.makeHeader()}
        {this.makeContent()}
        {this.makeTags()}
      </div>
    );
  }
}

FergBlogPage.propTypes = propTypes;

FergBlogPage.fetchData = function (store, params) {
  const state = store.getState();
  const type = getPagesType(params.location);
  const ret = [];
  const api = state.api;

  if (!api[PAGE_API_KEY[type]]) {
    ret.push(
      store.dispatch(apiFetch(
        PAGE_API_KEY[type], PAGE_API_URL, {
          type,
          id: parseInt(params.page_id, 10) || 0,
          cache: true,
        }
      ))
    );
  }

  if (!state.title) {
    store.dispatch(titleSet(Lang(`page.${type}-title`, {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  const type = getPagesType(state.location);

  return {
    type,
    lang: state.lang,
    page: state.api[PAGE_API_KEY[type]] || false,
  };
})(FergBlogPage);
