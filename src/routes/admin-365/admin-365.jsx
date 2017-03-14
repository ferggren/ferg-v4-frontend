'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent } from 'components/app';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('365', langRu, 'ru');
Lang.updateLang('365', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
};

class Admin365 extends React.PureComponent {
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
    this.props.dispatch(titleSet(Lang('365.title')));
  }

  render() {
    return (
      <AppContent>
        {Lang('365.not_found')}
      </AppContent>
    );
  }
}

Admin365.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(Admin365);
