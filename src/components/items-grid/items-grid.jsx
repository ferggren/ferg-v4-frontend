'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import deepClone from 'libs/deep-clone';
import ItemsGridItem from './components/item';
import './styles';

const propTypes = {
  items: PropTypes.array.isRequired,
  spacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
};

const defaultProps = {
  spacing: 3,
  width: 'auto',
  minHeight: 200,
  maxHeight: 300,
};

class ItemsGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    const width = parseInt(props.width, 10);

    this.state = {
      width: isNaN(width) ? 1110 : width,
      locked: !isNaN(width),
    };

    this.ref_grid = false;
    this.update_interval = false;

    this.setGridRef = this.setGridRef.bind(this);
    this.updateGridWidth = this.updateGridWidth.bind(this);
  }

  componentDidMount() {
    this.updateGridWidth();

    this.update_interval = setInterval(this.updateGridWidth, 500);
    window.addEventListener('resize', this.updateGridWidth);
  }

  componentWillUnmount() {
    clearInterval(this.update_interval);
    document.removeEventListener('resize', this.updateGridWidth);

    this.update_interval = false;
    this.ref_grid = false;
  }

  setGridRef(c) {
    this.ref_grid = c;
  }

  updateGridWidth() {
    if (!this.ref_grid || this.state.locked) {
      return;
    }

    const width = this.ref_grid.offsetWidth;

    if (!width || width === this.state.width) {
      return;
    }

    this.setState({ width });
  }

  updateItemsWidth(items) {
    if (!items.length) return;

    for (let i = 0; i < items.length; ++i) {
      const rnd = (Math.sin(i) + 1) / 2;
      const c = (Math.floor((rnd * (115 - 85)) + 85) / 100) - 1;

      items[i].width = 100;
      
      if (items[i].ratio) {
        items[i].ratio += c;
      }
    }

    const length = items.length;
    let position = 0;

    while (position < length) {
      let total_width = 0;
      let stop = position;

      if (!items[stop].ratio) {
        items[stop].width = 100;
        items[stop].height = this.props.maxHeight;
        ++position;
        continue;
      }

      for (; stop < length; ++stop) {
        items[stop].min_width = Math.floor(items[stop].ratio * this.props.minHeight);

        if (total_width === 0) {
          total_width += items[stop].min_width;
          continue;
        }

        if (items[stop].ratio && ((total_width + items[stop].min_width) <= this.state.width)) {
          total_width += items[stop].min_width;
          continue;
        }

        break;
      }

      let width_left = 100;
      let height = (this.state.width * this.props.minHeight) / total_width;
      height = Math.round(Math.min(this.props.maxHeight, height));

      for (;position < stop; ++position) {
        items[position].width = Math.floor((items[position].min_width * 100) / total_width);
        items[position].height = height;
        width_left -= items[position].width;
      }

      items[position - 1].width += width_left;
    }
  }

  render() {
    const items = deepClone(this.props.items);
    this.updateItemsWidth(items);

    const list = items.map((item, index) => {
      /* eslint-disable react/no-array-index-key */
      
      return (
        <ItemsGridItem
          key={`${item.url}${index}`}
          item={item}
          spacing={this.props.spacing}
        />
      );
    });

    const style = {
      marginLeft: `-${this.props.spacing}px`,
    };

    return (
      <div className="items-grid__wrapper" ref={this.setGridRef}>
        <div className="items-grid" style={style}>
          {list}
          <div style={{ clear: 'both' }} />
        </div>
      </div>
    );
  }
}

ItemsGrid.propTypes = propTypes;
ItemsGrid.defaultProps = defaultProps;

export default ItemsGrid;
