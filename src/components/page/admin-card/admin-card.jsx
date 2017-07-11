'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import { niceMonthFormat } from 'libs/nice-time';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('pages-admin-card', langRu, 'ru');
Lang.updateLang('pages-admin-card', langEn, 'en');

const propTypes = {
  page: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

class PageAdminCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onRestore = this.onRestore.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  onRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onRestore(this.props.page);
  }

  onDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onDelete(this.props.page);
  }

  onShow(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onShow(this.props.page);
  }

  onHide(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onHide(this.props.page);
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onSelect(this.props.page);
  }

  makeHeader() {
    const page = this.props.page;
    let title = null;
    let desc = null;

    if (page.title) {
      title = <div className="page-admin-card__header-title">{page.title}</div>;
    }

    if (page.desc) {
      desc = <div className="page-admin-card__header-desc">{page.desc}</div>;
    }

    if (!title && !desc) {
      return null;
    }

    return (
      <div className="page-admin-card__header">
        {title}
        {desc}
      </div>
    );
  }

  makeButtonDelete() {
    if (this.props.page.loading || this.props.page.deleted) {
      return null;
    }

    return this.makeButton('delete', this.onDelete);
  }

  makeButtonRestore() {
    if (this.props.page.loading || !this.props.page.deleted) {
      return null;
    }

    return this.makeButton('restore', this.onRestore);
  }

  makeButtonHide() {
    if (this.props.page.loading || !this.props.page.visible) {
      return null;
    }

    return this.makeButton('hide', this.onHide);
  }

  makeButtonShow() {
    if (this.props.page.loading || this.props.page.visible) {
      return null;
    }

    return this.makeButton('show', this.onShow);
  }

  makeButton(type, callback) {
    const props = {
      className: `page-admin-card__button page-admin-card__button--${type}`,
      onClick: callback,
    };

    return <div {...props}>{Lang(`pages-admin-card.page_${type}`, this.props.lang)}</div>;
  }

  makeLoader() {
    if (!this.props.page.loading) {
      return null;
    }

    return (
      <div className="page-admin-card__loader">
        <Loader type="small" />
      </div>
    );
  }

  makeVersions() {
    return (
      <div className="page-admin-card__button page-admin-card__versions">
        {this.props.page.versions.join(', ')}
      </div>
    );
  }

  makeDate() {
    const page = this.props.page;

    if (page.loading || !page.timestamp) {
      return null;
    }

    return (
      <div className="page-admin-card__button page-admin-card__date">
        {niceMonthFormat(page.timestamp)}
      </div>
    );
  }

  makeIcoHidden() {
    if (this.props.page.visible) {
      return null;
    }
    return <div className="page-admin-card__ico-hidden" />;
  }

  render() {
    const page = this.props.page;
    const props = {
      onClick: this.onClick,
      className: 'page-admin-card',
      style: {},
    };

    if (!page.visible) {
      props.className += ' page-admin-card--hidden';
    }

    if (page.deleted) {
      props.className += ' page-admin-card--deleted';
    }

    if (page.preview.small) {
      props.style.backgroundImage = `url('${page.preview.small}')`;
    }

    return (
      <div {...props}>
        {this.makeHeader()}
        {this.makeButtonShow()}
        {this.makeButtonHide()}
        {this.makeButtonDelete()}
        {this.makeButtonRestore()}
        {this.makeLoader()}
        {this.makeVersions()}
        {this.makeDate()}
        {this.makeIcoHidden()}
      </div>
    );
  }
}

PageAdminCard.propTypes = propTypes;

export default PageAdminCard;
