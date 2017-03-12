'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { AppContent } from 'components/app';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('blog', langRu, 'ru');
Lang.updateLang('blog', langEn, 'en');

const propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  lang: React.PropTypes.string.isRequired,
};

class FergBlog extends React.PureComponent {
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
    this.props.dispatch(titleSet(Lang('blog.title')));
  }

  render() {
    return (
      <AppContent>
        FergBlog
      </AppContent>
    );
  }
}

FergBlog.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(FergBlog);
