'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Button from './components/button';
import './styles';

const propTypes = {
  page: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  pages: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  dynamicSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  staticSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  url: PropTypes.string,
  onSelect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
};

const defaultProps = {
  url: '',
  onSelect: false,
  dynamicSize: 2,
  staticSize: 1,
};

class Paginator extends React.PureComponent {
  updateProps() {
    this.page = parseInt(this.props.page, 10);
    this.pages = parseInt(this.props.pages, 10);
    this.dynamic_size = parseInt(this.props.dynamicSize, 10);
    this.static_size = parseInt(this.props.staticSize, 10);

    if (isNaN(this.page)) this.page = 1;
    if (isNaN(this.pages)) this.pages = 1;
    if (isNaN(this.dynamic_size)) this.dynamic_size = 2;
    if (isNaN(this.static_size)) this.static_size = 1;
  }

  makePaginatorPrev() {
    return (
      <Button
        title="←"
        page={Math.max(this.page - 1, 1)}
        active={this.page > 1}
        onSelect={this.props.onSelect}
        url={this.props.url}
      />
    );
  }

  makePaginatorNext() {
    return (
      <Button
        title="→"
        page={Math.min(this.page + 1, this.pages)}
        active={this.page < this.pages}
        onSelect={this.props.onSelect}
        url={this.props.url}
      />
    );
  }

  makePaginatorPages() {
    // if total size of pages is less than static
    if (this.pages <= ((this.static_size * 2) + 1)) {
      // than we can go in a simple way
      return this.makePagesRange(1, this.pages);
    }

    let list = [];

    // left static pages
    list = list.concat(this.makePagesRange(1, this.static_size));

    const dynamic_left = Math.max(
      this.page - this.dynamic_size,
      this.static_size + 1
    );

    const dynamic_right = Math.min(
      this.page + this.dynamic_size,
      this.pages - this.static_size
    );

    // if needed - separator
    if ((this.static_size + 1) < dynamic_left) {
      list.push(
        <Button
          title="..."
          key={'buttons_left'}
        />
      );
    }

    // dynamic middle pages
    list = list.concat(this.makePagesRange(
      dynamic_left,
      dynamic_right
    ));

    // if needed - separator
    if ((this.pages - this.static_size) > dynamic_right) {
      list.push(
        <Button
          title="..."
          key={'buttons_right'}
        />
      );
    }

    // right static pages
    list = list.concat(this.makePagesRange(
      (this.pages - this.static_size) + 1,
      this.pages
    ));

    return list;
  }

  makePagesRange(page_from, page_to) {
    const range = [];

    for (let i = page_from; i <= page_to; ++i) {
      range.push(
        <Button
          key={`page_${i}`}
          title={i}
          page={i}
          active={i !== this.page}
          onSelect={this.props.onSelect}
          url={this.props.url}
        />
      );
    }

    return range;
  }

  render() {
    this.updateProps();

    return (
      <div className="paginator">
        <div className="paginator__prev">
          {this.makePaginatorPrev()}
        </div>

        <div className="paginator__pages">
          {this.makePaginatorPages()}
        </div>

        <div className="paginator__next">
          {this.makePaginatorNext()}
        </div>
      </div>
    );
  }
}

Paginator.propTypes = propTypes;
Paginator.defaultProps = defaultProps;

export default Paginator;
