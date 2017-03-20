'use strict';

import React from 'react';
import Lang from 'libs/lang';
import langEn from './lang/en';
import langRu from './lang/ru';
import './styles';

Lang.updateLang('landing', langEn, 'en');
Lang.updateLang('landing', langRu, 'ru');

const propTypes = {
  lang: React.PropTypes.string.isRequired,
};

class LandingHeader extends React.PureComponent {
  render() {
    const lang = this.props.lang;

    return (
      <div className="landing-header" id="ferg-header">
        <div className="landing-header__contacts-wrapper">
          <h4 className="landing-header__contacts-title">
            {Lang('landing.contact', {}, lang)}
          </h4>
          
          <ul className="landing-header__contacts">
            <li className="landing-header__contact landing-header__contact--mail">
              <a
                href="mailto:me@ferg.in"
                rel="noreferrer noopener"
                title={Lang('landing.contact_via_email', {}, lang)}
              >
                {Lang('landing.contact_via_email', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--skype">
              <a
                href="skype:ferggren?chat"
                rel="noreferrer noopener"
                title={Lang('landing.contact_via_skype', {}, lang)}
              >
                {Lang('landing.contact_via_skype', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--github">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://github.com/ferggren" 
                title={Lang('landing.contact_via_github', {}, lang)}
              >
                {Lang('landing.contact_via_github', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--linkedin">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://linkedin.com/in/ferggren/" 
                title={Lang('landing.contact_via_linkedin', {}, lang)}
              >
                {Lang('landing.contact_via_linkedin', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--moikrug">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://moikrug.ru/ferg-51346" 
                title={Lang('landing.contact_via_moikrug', {}, lang)}
              >
                {Lang('landing.contact_via_moikrug', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--facebook">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://www.facebook.com/ferggren"
                title={Lang('landing.contact_via_facebook', {}, lang)}
              >
                {Lang('landing.contact_via_facebook', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--vk">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://vk.com/id4867738"
                title={Lang('landing.contact_via_vk', {}, lang)}
              >
                {Lang('landing.contact_via_vk', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--500px">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://500px.com/ferggren"
                title={Lang('landing.contact_via_500px', {}, lang)}
              >
                {Lang('landing.contact_via_500px', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--flickr">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://www.flickr.com/photos/ferggren/"
                title={Lang('landing.contact_via_flickr', {}, lang)}
              >
                {Lang('landing.contact_via_flickr', {}, lang)}
              </a>
            </li>

            <li className="landing-header__contact landing-header__contact--instagram">
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
      </div>
    );
  }
}

LandingHeader.propTypes = propTypes;

export default LandingHeader;
