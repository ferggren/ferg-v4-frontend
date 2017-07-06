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
    const lang = this.props.lang;
    let switch_class = 'app-footer__lang-switch';

    if (lang) {
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

          <div className="app-footer__contacts-wrapper">
            <h4 className="app-footer__contacts-title">
              {Lang('landing.contact', {}, lang)}
            </h4>
            
            <ul className="app-footer__contacts">
              <li className="app-footer__contact app-footer__contact--mail">
                <a
                  href="mailto:me@ferg.in"
                  rel="noreferrer noopener"
                  title={Lang('landing.contact_via_email', {}, lang)}
                >
                  {Lang('landing.contact_via_email', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--skype">
                <a
                  href="skype:ferggren?chat"
                  rel="noreferrer noopener"
                  title={Lang('landing.contact_via_skype', {}, lang)}
                >
                  {Lang('landing.contact_via_skype', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--github">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://github.com/ferggren" 
                  title={Lang('landing.contact_via_github', {}, lang)}
                >
                  {Lang('landing.contact_via_github', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--linkedin">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://linkedin.com/in/ferggren/" 
                  title={Lang('landing.contact_via_linkedin', {}, lang)}
                >
                  {Lang('landing.contact_via_linkedin', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--facebook">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://www.facebook.com/ferggren"
                  title={Lang('landing.contact_via_facebook', {}, lang)}
                >
                  {Lang('landing.contact_via_facebook', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--vk">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://vk.com/id4867738"
                  title={Lang('landing.contact_via_vk', {}, lang)}
                >
                  {Lang('landing.contact_via_vk', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--500px">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://500px.com/ferggren"
                  title={Lang('landing.contact_via_500px', {}, lang)}
                >
                  {Lang('landing.contact_via_500px', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--flickr">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://www.flickr.com/photos/ferggren/"
                  title={Lang('landing.contact_via_flickr', {}, lang)}
                >
                  {Lang('landing.contact_via_flickr', {}, lang)}
                </a>
              </li>

              <li className="app-footer__contact app-footer__contact--instagram">
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://instagram.com/ferggren/"
                  title={Lang('landing.contact_via_instagram', {}, lang)}
                >
                  {Lang('landing.contact_via_instagram', {}, lang)}
                </a>
              </li>
            </ul>
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
