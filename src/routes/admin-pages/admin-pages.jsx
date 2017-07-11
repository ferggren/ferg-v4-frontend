'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import Paginator from 'components/paginator';
import TagsCloud from 'components/tags-cloud';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { ContentWrapper, Block, Grid, GridItem, FormButton, FormCallout } from 'components/ui';
import { titleSet } from 'actions/title';
import { getPagesType } from 'libs/pages';
import { PageAdminCard } from 'components/page';
import Request from 'libs/request';
import deepClone from 'libs/deep-clone';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

const TAGS_WIDTH = '200px';

Lang.updateLang('admin-pages', langRu, 'ru');
Lang.updateLang('admin-pages', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

class AdminPages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pages: 1,
      list: [],
      tags: false,
      tag: '',
      loading: false,
      creating: false,
    };

    this.requests = {};

    this.loadPages = this.loadPages.bind(this);
    this.loadTags = this.loadTags.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.createPage = this.createPage.bind(this);
    this.restorePage = this.restorePage.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.showPage = this.showPage.bind(this);
    this.hidePage = this.hidePage.bind(this);
    this.editPage = this.editPage.bind(this);
  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
    this.loadTags();
    this.loadPages();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang || prevProps.type !== this.props.type) {
      this.updateTitle();
      this.loadTags();
      this.loadPages();
    }
  }

  componentWillUnmount() {
    Object.keys(this.requests).forEach((request) => {
      if (!this.requests[request]) {
        return;
      }

      Request.abort(this.requests[request]);
      this.requests[request] = false;
    });

    this.requests = {};
  }

  loadPages(page = 1) {
    if (this.requests.pages) {
      Request.abort(this.requests.pages);
    }

    this.requests.pages = Request.fetch(
      '/api/pages/getPages/', {
        method: 'POST',

        success: (response) => {
          this.requests.pages = null;

          this.setState({
            page: response.page,
            pages: response.pages,
            list: response.list,
            loading: false,
          });
        },

        error: () => {
          this.requests.pages = null;
          this.setState({ loading: false });
        },

        data: {
          page,
          type: this.props.type,
          visible: 'all',
          tag: this.state.tag,
        },
      }
    );

    this.setState({ loading: true, page, list: [] });
  }

  loadTags() {
    if (this.requests.tags) {
      Request.abort(this.requests.tags);
    }

    this.requests.tags = Request.fetch(
      '/api/pages/getTags/', {
        method: 'POST',

        success: (tags) => {
          this.requests.tags = null;

          this.setState({ tags });
        },

        error: () => {
          this.requests.tags = null;
          this.setState({ tags: [] });
        },

        data: {
          type: this.props.type,
          visible: 'all',
        },
      }
    );

    this.setState({ tags: false });
  }

  selectTag(tag) {
    this.setState({
      tag: this.state.tag === tag ? '' : tag,
    }, this.loadPages);
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang(`admin-pages.${this.props.type}-title`)));
  }

  selectPage(page) {
    this.loadPages(page);
  }

  createPage() {
    if (this.state.creating) {
      return;
    }

    if (this.requests.create) {
      Request.abort(this.requests.create);
    }

    this.setState({ creating: true });

    this.requests.create = Request.fetch(
      '/api/pages/createPage/', {
        method: 'POST',

        success: (page) => {
          this.requests.create = null;
          this.setState({ creating: false });
          this.editPage(page);
        },

        error: () => {
          this.requests.create = null;
          this.setState({ creating: false });
        },

        data: {
          type: this.props.type,
        },
      }
    );
  }

  deletePage(page_deleted) {
    const pages = deepClone(this.state.list);
    const page = pages.find((e) => { return e.id === page_deleted.id; });
    const key = `page_${page_deleted.id}`;

    if (!page) {
      return;
    }

    if (this.requests[key]) {
      Request.abort(this.requests[key]);
    }

    page.loading = true;

    this.requests[key] = Request.fetch(
      '/api/pages/deletePage/', {
        method: 'POST',

        success: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_deleted.id; });

          if (page_edited) {
            page_edited.deleted = true;
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        error: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_deleted.id; });

          if (page_edited) {
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        data: { id: page.id },
      }
    );

    this.setState({ list: pages });
  }

  showPage(page_show) {
    const pages = deepClone(this.state.list);
    const page = pages.find((e) => { return e.id === page_show.id; });
    const key = `page_${page_show.id}`;

    if (!page) {
      return;
    }

    if (this.requests[key]) {
      Request.abort(this.requests[key]);
    }

    page.loading = true;

    this.requests[key] = Request.fetch(
      '/api/pages/showPage/', {
        method: 'POST',

        success: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_show.id; });

          if (page_edited) {
            page_edited.visible = true;
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        error: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_show.id; });

          if (page_edited) {
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        data: { id: page.id },
      }
    );

    this.setState({ list: pages });
  }

  hidePage(page_hide) {
    const pages = deepClone(this.state.list);
    const page = pages.find((e) => { return e.id === page_hide.id; });
    const key = `page_${page_hide.id}`;

    if (!page) {
      return;
    }

    if (this.requests[key]) {
      Request.abort(this.requests[key]);
    }

    page.loading = true;

    this.requests[key] = Request.fetch(
      '/api/pages/hidePage/', {
        method: 'POST',

        success: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_hide.id; });

          if (page_edited) {
            page_edited.visible = false;
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        error: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_hide.id; });

          if (page_edited) {
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        data: { id: page.id },
      }
    );

    this.setState({ list: pages });
  }

  restorePage(page_restored) {
    const pages = deepClone(this.state.list);
    const page = pages.find((e) => { return e.id === page_restored.id; });
    const key = `page_${page_restored.id}`;

    if (!page) {
      return;
    }

    if (this.requests[key]) {
      Request.abort(this.requests[key]);
    }

    page.loading = true;

    this.requests[key] = Request.fetch(
      '/api/pages/restorePage/', {
        method: 'POST',

        success: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_restored.id; });

          if (page_edited) {
            page_edited.deleted = false;
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        error: () => {
          this.requests[key] = null;

          const pages_edited = deepClone(this.state.list);
          const page_edited = pages_edited.find((e) => { return e.id === page_restored.id; });

          if (page_edited) {
            page_edited.loading = false;
          }

          this.setState({ list: pages_edited });
        },

        data: { id: page.id },
      }
    );

    this.setState({ list: pages });
  }

  editPage(page) {
    if (page.loading) {
      return;
    }

    browserHistory.push(`/${this.props.lang}/admin/${this.props.type}/${page.id}`);
  }

  makeButton() {
    return (
      <Block>
        <FormButton onClick={this.createPage} disabled={this.state.creating}>
          {Lang('admin-pages.create_new_page')}
        </FormButton>
      </Block>
    );
  }

  makePagesList() {
    if (!this.state.list.length) {
      if (this.state.loading) {
        return null;
      }

      return (
        <Block>
          <FormCallout>
            {Lang('admin-pages.pages_not_found')}
          </FormCallout>
        </Block>
      );
    }

    const ret = [];

    this.state.list.forEach((page) => {
      ret.push(
        <Block key={page.id}>
          <PageAdminCard
            page={page}
            lang={this.props.lang}
            onSelect={this.editPage}
            onDelete={this.deletePage}
            onRestore={this.restorePage}
            onHide={this.hidePage}
            onShow={this.showPage}
          />
        </Block>
      );
    });

    return <Block>{ret}</Block>;
  }

  makeLoader() {
    if (!this.state.loading && !this.state.creating) {
      return null;
    }

    return <Block><Loader /></Block>;
  }

  makePaginator() {
    if (this.state.loading || this.state.creating) {
      return null;
    }

    return (
      <Block>
        <Paginator
          page={this.state.page}
          pages={this.state.pages}
          onSelect={this.selectPage}
        />
      </Block>
    );
  }

  makeTags() {
    if (this.state.tags === false) {
      return <Block><Loader /></Block>;
    }

    if (this.state.tags.length === 0) {
      return <Block>{Lang('admin-pages.tags_not_found', this.props.lang)}</Block>;
    }

    return (
      <TagsCloud
        group={`pages_${this.props.type}_all`}
        tags={this.state.tags}
        selected={this.state.tag}
        onSelect={this.selectTag}
      />
    );
  }

  render() {
    return (
      <ContentWrapper>
        <Grid justifyContent="space-between">
          <GridItem width={`calc(100% - ${TAGS_WIDTH} - 30px)`}>
            {this.makeButton()}
            {this.makePagesList()}
            {this.makeLoader()}
            {this.makePaginator()}
          </GridItem>

          <GridItem width={TAGS_WIDTH}>
            {this.makeTags()}
          </GridItem>
        </Grid>
      </ContentWrapper>
    );
  }
}

AdminPages.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    type: getPagesType(state.location),
  };
})(AdminPages);
