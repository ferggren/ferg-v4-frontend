'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent } from 'components/app';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('route-gallery', langRu, 'ru');
Lang.updateLang('route-gallery', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
};

class AdminGallery extends React.PureComponent {
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
    this.props.dispatch(titleSet(Lang('route-gallery.title')));
  }

  render() {
    return (
      <AppContent>
        AdminGallery
      </AppContent>
    );
  }
}

AdminGallery.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(AdminGallery);
