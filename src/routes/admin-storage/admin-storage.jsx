'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppContent } from 'components/app';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('route-storage', langRu, 'ru');
Lang.updateLang('route-storage', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

class AdminStorage extends React.PureComponent {
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
    this.props.dispatch(titleSet(Lang('route-storage.title')));
  }

  render() {
    return (
      <AppContent>
        AdminStorage
      </AppContent>
    );
  }
}

AdminStorage.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(AdminStorage);
