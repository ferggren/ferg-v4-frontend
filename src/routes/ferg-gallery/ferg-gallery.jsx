'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent } from 'components/app';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('gallery', langRu, 'ru');
Lang.updateLang('gallery', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
};

class FergGallery extends React.PureComponent {
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
    this.props.dispatch(titleSet(Lang('gallery.title')));
  }

  render() {
    return (
      <AppContent>
        FergGallery
      </AppContent>
    );
  }
}

FergGallery.propTypes = propTypes;

FergGallery.fetchData = function (store) {
  const state = store.getState();
  const ret = [];

  if (!state.title) {
    store.dispatch(titleSet(Lang('gallery.title', {}, state.lang)));
  }

  return ret;
};

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(FergGallery);
