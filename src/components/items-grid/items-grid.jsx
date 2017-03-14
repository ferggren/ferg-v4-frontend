'use strict';

import React from 'react';
import clone from 'libs/clone';
import ItemsGridItem from './components/item';
import './styles';

const propTypes = {
  items: React.PropTypes.array.isRequired,
  spacing: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.numer,
  ]),
};

const defaultProps = {
  spacing: 5,
};

class ItemsGrid extends React.PureComponent {
  updateItemsWidth(items) {
    if (!items.length) return;

    for (let i = 0; i < items.length; ++i) {
      items[i].width = 100;
    }

    const length = items.length;
    const ratio_max = 4;
    let position = 0;

    while (position < length) {
      let ratio = 0;
      let stop = position;

      for (; stop < length; ++stop) {
        if (ratio === 0) {
          ratio += items[stop].ratio;
          continue;
        }

        if (ratio + items[stop].ratio <= ratio_max) {
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
    const items = clone(this.props.items);
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
