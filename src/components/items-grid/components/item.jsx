'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { niceMonthFormat } from 'libs/nice-time';

const propTypes = {
  item: PropTypes.object.isRequired,
  spacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const defaultProps = {
  spacing: 5,
};

class ItemsGridItem extends React.PureComponent {
  makeHeader() {
    let desc = null;
    let title = null;

    if (this.props.item.title) {
      title = (
        <h4 className="items-grid__item-title">
          {this.props.item.title}
        </h4>
      );
    }

    if (this.props.item.desc) {
      desc = (
        <div className="items-grid__item-desc">
          {this.props.item.desc}
        </div>
      );
    }

    if (!desc && !title) return null;

    return (
      <div>
        {title}
        {desc}
      </div>
    );
  }

  makeDate() {
    if (!this.props.item.date) return null;

    return (
      <div className="items-grid__item-date">
        {niceMonthFormat(this.props.item.date)}
      </div>
    );
  }

  render() {
    const item = this.props.item;
    const header = this.makeHeader();
    const date = this.makeDate();

    const item_props = {
      to: item.url,
      className: 'items-grid__item',
      style: {
        margin: `0px 0px ${this.props.spacing}px ${this.props.spacing}px`,
      },
    };

    const wrapper_props = {
      className: 'items-grid__item-wrapper',
      style: {
        width: `${item.width}%`,
      },
    };

    if (item.preview) {
      item_props.style.backgroundImage = `url('${item.preview}')`;
    }

    if (header || date) {
      item_props.className += ' items-grid__item--detailed';
    }

    return (
      <div {...wrapper_props}>
        <Link {...item_props}>
          {header}
          {date}
        </Link>
      </div>
    );
  }
}

ItemsGridItem.propTypes = propTypes;
ItemsGridItem.defaultProps = defaultProps;

export default ItemsGridItem;
