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
  maxRatio: PropTypes.number,
};

const defaultProps = {
  spacing: 5,
  maxRatio: 4,
};

class ItemsGrid extends React.PureComponent {
  updateItemsWidth(items) {
    if (!items.length) return;

    for (let i = 0; i < items.length; ++i) {
      const rnd = Math.sin(i);
      const c = Math.floor((rnd * (110 - 90)) + 90) / 100;

      items[i].width = 100;
      items[i].ratio *= c;
    }

    const length = items.length;
    let position = 0;

    while (position < length) {
      let ratio = 0;
      let stop = position;

      for (; stop < length; ++stop) {
        if (ratio === 0) {
          ratio += items[stop].ratio;
          continue;
        }

        if (ratio + items[stop].ratio <= this.props.maxRatio) {
          ratio += items[stop].ratio;
          continue;
        }

        break;
      }

      let width_left = 100;

      for (;position < stop; ++position) {
        items[position].width = Math.floor((items[position].ratio * 100) / ratio);
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
      <div className="items-grid" style={style}>
        {list}
        <div style={{ clear: 'both' }} />
      </div>
    );
  }
}

ItemsGrid.propTypes = propTypes;
ItemsGrid.defaultProps = defaultProps;

export default ItemsGrid;
