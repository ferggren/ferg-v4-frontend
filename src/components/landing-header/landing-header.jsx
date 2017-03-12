'use strict';

import React from 'react';
import './styles';

class LandingHeader extends React.PureComponent {
  render() {
    return (
      <div className="site-header" id="ferg-header">
        <div className="site-header__contacts-wrapper">
          <h4 className="site-header__contacts-title">
            Contact me
          </h4>
          
          <ul className="site-header__contacts">
            <li className="site-header__contact site-header__contact--mail">
              <a
                href="mailto:me@ferg.in"
                rel="noreferrer noopener"
                title="Contact me via email"
              >Contact me via email</a>
            </li>

            <li className="site-header__contact site-header__contact--skype">
              <a
                href="skype:ferggren?chat"
                rel="noreferrer noopener"
                title="Contact me on Skype"
              >Contact me on Skype</a>
            </li>

            <li className="site-header__contact site-header__contact--github">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://github.com/ferggren" 
                title="Find me on Github"
              >Find me on Github</a>
            </li>

            <li className="site-header__contact site-header__contact--facebook">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://www.facebook.com/ferggren"
                title="Contact me on Facebook"
              >Contact me on Facebook</a>
            </li>

            <li className="site-header__contact site-header__contact--vk">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://vk.com/id4867738"
                title="Contact me on VK"
              >Contact me on VK</a>
            </li>

            <li className="site-header__contact site-header__contact--500px">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://500px.com/ferggren"
                title="Follow me on 500px"
              >Follow me on 500px</a>
            </li>

            <li className="site-header__contact site-header__contact--flickr">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://www.flickr.com/photos/ferggren/"
                title="Follow me on Flickr"
              >Follow me on Flickr</a>
            </li>

            <li className="site-header__contact site-header__contact--instagram">
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://instagram.com/ferggren/"
                title="Follow me on Instagram"
              >Follow me on Instagram</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default LandingHeader;
