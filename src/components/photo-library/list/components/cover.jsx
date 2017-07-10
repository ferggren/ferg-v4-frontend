'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  onBack: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

const defaultProps = {

};

class PhotoLibraryCover extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onBack = this.onBack.bind(this);
  }

  onBack(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onBack();
  }

  makePhotos() {
    const photos = parseInt(this.props.collection.photos, 10);

    if (isNaN(photos) || photos <= 0) {
      return null;
    }

    return <div className="photolibrary__cover-photos">{photos}</div>;
  }

  render() {
    const collection = this.props.collection;
    const style = {};

    if (collection.cover) {
      style.backgroundImage = `url('${collection.cover}')`;
    }

    return (
      <div className="photolibrary__cover-wrapper">
        <div className="photolibrary__cover-photo" style={style} />

        <div className="photolibrary__cover-name-wrapper">
          <div className="photolibrary__cover-name">
            {collection.name}
          </div>
        </div>
        
        <a className="photolibrary__cover-back" onClick={this.onBack}>
          {Lang('photolibrary.collections_back', this.props.lang)}
        </a>

        {this.makePhotos()}
      </div>
    );
  }
}

PhotoLibraryCover.propTypes = propTypes;
PhotoLibraryCover.defaultProps = defaultProps;

export default PhotoLibraryCover;
