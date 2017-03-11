'use strict';

import React from 'react';
import './styles';

/* eslint-disable jsx-a11y/anchor-has-content */

class SiteHeader extends React.PureComponent {
  render() {
    return (
      <div className="site-header" id="ferg-header">
        <div className="site-header__contacts-wrapper">
          <div className="site-header__contacts">
            <a
              href="mailto:me@ferg.in"
              rel="noreferrer noopener"
              title="Contact me via email"
              className="site-header__contact site-header__contact--mail"
            >
              Contact me via email
            </a>

            <a
              href="skype:ferggren?chat"
              rel="noreferrer noopener"
              title="Contact me on Skype"
              className="site-header__contact site-header__contact--skype"
            >
              Contact me on Skype
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://github.com/ferggren" 
              title="Find me on Github"
              className="site-header__contact site-header__contact--github"
            >
              Find me on Github
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://www.facebook.com/ferggren"
              title="Contact me on Facebook"
              className="site-header__contact site-header__contact--facebook"
            >
              Contact me on Facebook
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://vk.com/id4867738"
              title="Contact me on VK"
              className="site-header__contact site-header__contact--vk"
            >
              Contact me on VK
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://500px.com/ferggren"
              title="Follow me on 500px"
              className="site-header__contact site-header__contact--500px"
            >
              Follow me on 500px
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://www.flickr.com/photos/ferggren/"
              title="Follow me on Flickr"
              className="site-header__contact site-header__contact--flickr"
            >
              Follow me on Flickr
            </a>

            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://instagram.com/ferggren/"
              title="Follow me on Instagram"
              className="site-header__contact site-header__contact--instagram"
            >
              Follow me on Instagram
            </a>

            <div className="floating-clear" />
          </div>
        </div>
      </div>
    );
  }
}

export default SiteHeader;
