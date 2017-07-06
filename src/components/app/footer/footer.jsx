'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('footer', langRu, 'ru');
Lang.updateLang('footer', langEn, 'en');

const propTypes = {
  onLangChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  lang: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  onLangChange: false,
  lang: false,
  link: false,
};

class AppFooter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onLangChange = this.onLangChange.bind(this);
  }

  onLangChange(e) {
    if (this.props.onLangChange) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onLangChange();
    }
  }

  render() {
    let switch_class = 'app-footer__lang-switch';

    if (this.props.lang) {
      switch_class += ` app-footer__lang-switch--${this.props.lang}`;
    }

    return (
      <div className="app-footer__wrapper">
        <div className="app-footer">
          <div className="app-footer__lang">
            <Link
              className={switch_class}
              to={this.props.link}
              onClick={this.onLangChange}
            >
              {Lang('footer.swap_lang')}
            </Link>
          </div>

          <div className="app-footer__copy">
            ferg.in &copy; 2013 – 2017
          </div>

          <div style={{ clear: 'both' }} />
        </div>
      </div>
    );
  }
}

AppFooter.propTypes = propTypes;
AppFooter.defaultProps = defaultProps;

export default AppFooter;
