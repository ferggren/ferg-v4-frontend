'use strict';

import React from 'react';
import { AppContent } from 'components/app';
import SiteHeader from 'components/site-header';
import { connect } from 'react-redux';
import { titleSet } from 'actions/title';
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
};

class SiteLanding extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.updateTitle();
    }
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('landing.title')));
  }

  render() {
    return (
      <div>
        <AppContent expand overlapHeader paddingTop={false} contentPadding={false}>
          <SiteHeader />
        </AppContent>

        <AppContent>
          Tags
        </AppContent>

        <AppContent>
          Feed
        </AppContent>
      </div>
    );
  }
}

SiteLanding.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(SiteLanding);
