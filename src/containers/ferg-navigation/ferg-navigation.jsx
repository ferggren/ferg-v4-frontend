'use strict';

import React from 'react';
import PropTypes from 'prop-types';
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
  user_name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  logged_in: PropTypes.bool.isRequired,
  is_admin: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

class FergNavigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      style: 'white',
    };

    this.request = false;
    this.ref_ferg_map = false;

    this.signOut = this.signOut.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updateScroll);

    this.updateRefs();
    this.updateScroll();
  }

  componentDidUpdate() {
    this.updateRefs();
    this.updateScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScroll);

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

  updateScroll() {
    if (typeof window === 'undefined') return;

    const scroll_top = window.pageYOffset || 0;
    let style = 'white';

    if (this.ref_ferg_map) {
      if (scroll_top > 0) {
        style = 'white';
      } else {
        style = 'transparent';
      }
    }

    if (style === this.state.style) return;

    this.setState({ style });
  }

  updateRefs() {
    this.ref_ferg_map = document.getElementById('ferg-map');
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
        style={this.state.style}
      />
    );
  }
}

FergNavigation.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
    title: state.title,
    logged_in: state.user.logged_in,
    is_admin: state.user.is_admin,
    user_name: state.user.info.name || '',
  };
})(FergNavigation);
