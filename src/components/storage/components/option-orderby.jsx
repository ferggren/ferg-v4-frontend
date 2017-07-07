'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  lang: PropTypes.string.isRequired,
  orderby: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
};

class StorageOptionOrderBy extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onOptionChange('orderby', e.target.dataset.orderby);
  }

  render() {
    const list = [
      'latest',
      'popular',
      'biggest',
    ];

    const buttons = [];

    list.forEach((orderby) => {
      const props = {
        className: 'storage__option',
        key: orderby,
        onClick: this.onSelect,
        'data-orderby': orderby,
      };
      
      if (orderby === this.props.orderby) {
        props.className += ' storage__option--selected';
      }

      buttons.push(
        <a {...props}>
          {Lang('storage.orderby_' + orderby, this.props.lang)}
        </a>
      );
    });

    return (
      <div className="storage__options-group">
        {buttons}
      </div>
    );
  }
}

StorageOptionOrderBy.propTypes = propTypes;

export default StorageOptionOrderBy;
