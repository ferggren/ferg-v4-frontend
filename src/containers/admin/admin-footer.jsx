'use strict';

import React from 'react';
import { AppFooter } from 'components/app';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { setLang } from 'actions/lang';
import Lang from 'libs/lang';

const propTypes = {
  location: React.PropTypes.string.isRequired,
  lang: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

class AdminFooter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.changeLang = this.changeLang.bind(this);
  }

  getNewLang() {
    return this.props.lang === 'ru' ? 'en' : 'ru';
  }

  getNewLocation() {
    let link = this.props.location;
    link = link.replace(/^\/(ru|en)\//, '/');

    return `/${this.getNewLang()}${link}`;
  }

  changeLang() {
    const new_lang = this.getNewLang();

    this.props.dispatch(setLang(new_lang));
    Lang.setLang(new_lang);
    browserHistory.push(this.getNewLocation());
  }

  render() {
    return (
      <AppFooter
        link={this.getNewLocation()}
        lang={this.props.lang}
        onLangChange={this.changeLang}
      />
    );
  }
}

AdminFooter.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
  };
})(AdminFooter);
