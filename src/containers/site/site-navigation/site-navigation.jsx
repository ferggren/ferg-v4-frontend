'use strict';

import React from 'react';
import { userLogout } from 'actions/user';
import { AppNavigation } from 'components/app';
import { connect } from 'react-redux';
import Lang from 'libs/lang';
import Request from 'libs/request';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('site-nav', langRu, 'ru');
Lang.updateLang('site-nav', langEn, 'en');

const propTypes = {
  user_name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  lang: React.PropTypes.string.isRequired,
  location: React.PropTypes.string.isRequired,
  logged_in: React.PropTypes.bool.isRequired,
  is_admin: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

class SiteNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.request = false;

    this.signOut = this.signOut.bind(this);
  }

  componentWillUnmount() {
    if (this.request) {
      Request.abort(this.request);
      this.request = false;
    }
  }

  getNavigation() {
    let url = this.props.location;
    url = url.replace(/^\/(?:ru|en)\//, '/');
    url = url.replace(/\?.*$/, '');

    const navigation = [
      {
        name: Lang('site-nav.landing'),
        current: !!url.match(/^\/$/),
        link: `/${this.props.lang}/`,
      },
      {
        name: Lang('site-nav.blog'),
        current: !!url.match(/^\/blog/),
        link: `/${this.props.lang}/blog/`,
      },
      {
        name: Lang('site-nav.events'),
        current: !!url.match(/^\/events/),
        link: `/${this.props.lang}/events/`,
      },
      {
        name: Lang('site-nav.365'),
        current: !!url.match(/^\/365/),
        link: `/${this.props.lang}/365/`,
      },
      {
        name: Lang('site-nav.gallery'),
        current: !!url.match(/^\/gallery/),
        link: `/${this.props.lang}/gallery/`,
      },
    ];

    if (this.props.is_admin) {
      navigation.push({
        name: 'Admin CP',
        link: `/${this.props.lang}/admin/`,
        align: 'right',
        routed: false,
      });
    }

    if (this.props.logged_in) {
      navigation.push({
        name: `${this.props.user_name} (sign out)`.trim(),
        align: 'right',
        onClick: this.signOut,
      });
    }

    if (!this.props.logged_in) {
      navigation.push({
        name: 'Sign in',
        align: 'right',
        link: '/oauth/init/vk/',
        routed: false,
      });
    }

    return navigation;
  }

  signOut() {
    this.request = Request.fetch(
      '/api/user/logout/', {
        success: () => {
          this.request = false;
          this.props.dispatch(userLogout());
        },

        error: () => {
          this.request = false;
        },
      }
    );
  }

  render() {
    return (
      <AppNavigation
        navigation={this.getNavigation()}
        title={this.props.title}
      />
    );
  }
}

SiteNavigation.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
    title: state.title,
    logged_in: state.user.logged_in,
    is_admin: state.user.is_admin,
    user_name: state.user.info.name || '',
  };
})(SiteNavigation);
