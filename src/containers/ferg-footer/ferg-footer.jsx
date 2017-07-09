'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from 'components/ui';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { setLang } from 'actions/lang';
import Lang from 'libs/lang';

const propTypes = {
  location: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

class FergFooter extends React.PureComponent {
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

    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Footer
        link={this.getNewLocation()}
        lang={this.props.lang}
        onLangChange={this.changeLang}
      />
    );
  }
}

FergFooter.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
  };
})(FergFooter);
