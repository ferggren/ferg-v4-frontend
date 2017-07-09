'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import PhotoLibraryCollection from './collection';

const propTypes = {
  collections: PropTypes.array.isRequired,
  default_collections: PropTypes.array.isRequired,
  onCollectionSelect: PropTypes.func.isRequired,
  onCollectionEdit: PropTypes.func.isRequired,
  onCollectionEditCancel: PropTypes.func.isRequired,
  onCollectionUpdate: PropTypes.func.isRequired,
  onCollectionDelete: PropTypes.func.isRequired,
  onCollectionRestore: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

const defaultProps = {

};

class PhotoLibraryCollections extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expandCollections = this.expandCollections.bind(this);
    this.collapseCollections = this.collapseCollections.bind(this);
  }

  expandCollections() {
    this.setState({ expanded: true });
  }

  collapseCollections() {
    this.setState({ expanded: false });
  }

  makeCollection(collection) {
    return (
      <PhotoLibraryCollection
        key={collection.id}
        collection={collection}
        onCollectionSelect={this.props.onCollectionSelect}
        onCollectionEdit={this.props.onCollectionEdit}
        onCollectionEditCancel={this.props.onCollectionEditCancel}
        onCollectionUpdate={this.props.onCollectionUpdate}
        onCollectionDelete={this.props.onCollectionDelete}
        onCollectionRestore={this.props.onCollectionRestore}
        lang={this.props.lang}
      />
    );
  }

  makeExpandButton() {
    return (
      <div className="photolibrary__collections-expand" onClick={this.expandCollections}>
        {Lang('photolibrary-list.collections_expand', this.props.lang)}
      </div>
    );
  }

  makeCollapseButton() {
    return (
      <div className="photolibrary__collections-collapse" onClick={this.collapseCollections}>
        {Lang('photolibrary-list.collections_collapse', this.props.lang)}
      </div>
    );
  }

  render() {
    const collections = [];
    let button = null;
    let hidden_count = 0;

    this.props.collections.forEach((collection) => {
      if (this.props.default_collections.indexOf(collection.id) >= 0) {
        collections.unshift(this.makeCollection(collection));
        return;
      }

      ++hidden_count;

      if (!this.state.expanded) {
        return;
      }
      
      collections.push(this.makeCollection(collection));
    });

    if (!this.state.expanded && hidden_count) {
      button = this.makeExpandButton();
    }

    if (this.state.expanded) {
      button = this.makeCollapseButton();
    }

    return (
      <div className="photolibrary__collections-wrapper">
        {collections}
        <div className="photolibrary__collections-clear" />
        {button}
      </div>
    );
  }
}

PhotoLibraryCollections.propTypes = propTypes;
PhotoLibraryCollections.defaultProps = defaultProps;

export default PhotoLibraryCollections;
