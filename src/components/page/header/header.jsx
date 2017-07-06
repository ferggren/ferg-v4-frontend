'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { niceMonthFormat } from 'libs/nice-time';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('page', langRu, 'ru');
Lang.updateLang('page', langEn, 'en');

const propTypes = {
  page: PropTypes.object.isRequired,
};

class PageHeader extends React.PureComponent {
  makeDate() {
    const page = this.props.page;

    if (!page.timestamp) return null;

    return (
      <div className="page-header__date">
        {niceMonthFormat(page.timestamp)}
      </div>
    );
  }

  makeTitle() {
    const page = this.props.page;
    let desc = null;
    let title = null;

    if (page.title) {
      title = <h1 className="page-header__title">{page.title}</h1>;
    }

    if (page.desc) {
      desc = <h2 className="page-header__desc">{page.desc}</h2>;
    }

    if (!desc && !title) return null;

    return (
      <div>
        {title}
        {desc}
      </div>
    );
  }

  makeLink() {
    const page = this.props.page;
    if (!page.preview || !page.preview.photo) return null;

    return (
      <a
        className="page-header__link"
        href={page.preview.photo}
        rel="noreferrer noopener"
        target="_blank"
      >
        {Lang('page.open_preview')}
      </a>
    );
  }

  render() {
    const page = this.props.page;
    const style = {};

    if (page.preview && page.preview.big) {
      style.backgroundImage = `url('${page.preview.big}')`;
    }

    return (
      <div className="page-header" style={style}>
        {this.makeTitle()}
        {this.makeLink()}
        {this.makeDate()}
      </div>
    );
  }
}

PageHeader.propTypes = propTypes;

export default PageHeader;
