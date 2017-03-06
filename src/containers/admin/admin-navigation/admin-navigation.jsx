'use strict';

import React from 'react';
import { AppNavigation } from 'components/app';
import { connect } from 'react-redux';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('admin-nav', langRu, 'ru');
Lang.updateLang('admin-nav', langEn, 'en');

const propTypes = {
  user_name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  lang: React.PropTypes.string.isRequired,
  location: React.PropTypes.string.isRequired,
};

class AdminNavigation extends React.PureComponent {
  getNavigation() {
    let url = this.props.location;
    url = url.replace(/^\/(?:ru|en)\//, '/');
    url = url.replace(/\?.*$/, '');

    const navigation = [
      {
        name: Lang('admin-nav.blog'),
        current: !!url.match(/^\/admin\/blog/),
        link: `/${this.props.lang}/admin/blog/`,
      },
      {
        name: Lang('admin-nav.events'),
        current: !!url.match(/^\/admin\/events/),
        link: `/${this.props.lang}/admin/events/`,
      },
      {
        name: Lang('admin-nav.365'),
        current: !!url.match(/^\/admin\/365/),
        link: `/${this.props.lang}/admin/365/`,
      },
      {
        name: Lang('admin-nav.gallery'),
        current: !!url.match(/^\/admin\/gallery/),
        link: `/${this.props.lang}/admin/gallery/`,
      },
      {
        name: Lang('admin-nav.storage'),
        current: !!url.match(/^\/admin\/storage/),
        link: `/${this.props.lang}/admin/storage/`,
      },
      {
        name: Lang('admin-nav.home'),
        link: `/${this.props.lang}/`,
        align: 'right',
        routed: false,
      },
      {
        name: this.props.user_name,
        align: 'right',
      },
    ];

    return navigation;
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

AdminNavigation.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
    location: state.location,
    title: state.title,
    logged_in: state.user.logged_in,
    user_name: state.user.info.name || '',
  };
})(AdminNavigation);
