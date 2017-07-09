'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import Loader from 'components/loader';

const propTypes = {
  collection: PropTypes.object.isRequired,
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

class PhotoLibraryCollection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref_input = false;

    this.onCollectionSelect = this.onCollectionSelect.bind(this);
    this.onCollectionEdit = this.onCollectionEdit.bind(this);
    this.onCollectionEditCancel = this.onCollectionEditCancel.bind(this);
    this.onCollectionUpdate = this.onCollectionUpdate.bind(this);
    this.onCollectionDelete = this.onCollectionDelete.bind(this);
    this.onCollectionRestore = this.onCollectionRestore.bind(this);
    this.setRefInput = this.setRefInput.bind(this);
  }

  componentWillUnmount() {
    this.ref_input = false;
  }

  onCollectionUpdate(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.ref_input) return;

    this.props.onCollectionUpdate(this.props.collection, this.ref_input.value);
  }

  onCollectionSelect() {
    if (this.props.collection.editing) return;
    this.props.onCollectionSelect(this.props.collection);
  }

  onCollectionEdit(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCollectionEdit(this.props.collection);
  }

  onCollectionEditCancel(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCollectionEditCancel(this.props.collection);
  }

  onCollectionRestore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCollectionRestore(this.props.collection);
  }

  onCollectionDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCollectionDelete(this.props.collection);
  }

  setRefInput(c) {
    this.ref_input = c;
  }

  makePhotos() {
    const collection = this.props.collection;

    if (collection.editing || parseInt(collection.photos, 10) <= 0) {
      return null;
    }

    return (
      <div className="photolibrary__collection-photos">
        {collection.photos}
      </div>
    );
  }

  makeName() {
    const collection = this.props.collection;

    if (collection.editing || !collection.name) {
      return null;
    }

    return (
      <div className="photolibrary__collection-name-wrapper">
        <div className="photolibrary__collection-name">
          {collection.name}
        </div>
      </div>
    );
  }

  makeEdit() {
    const collection = this.props.collection;

    if (parseInt(collection.id, 10) <= 0 || collection.editing || collection.loading) {
      return null;
    }

    return (
      <a className="photolibrary__collection-edit" onClick={this.onCollectionEdit}>
        {Lang('photolibrary-list.collection_edit', this.props.lang)}
      </a>
    );
  }

  makeAbort() {
    const collection = this.props.collection;

    if (!collection.editing || collection.loading) {
      return null;
    }

    return (
      <a className="photolibrary__collection-abort" onClick={this.onCollectionEditCancel}>
        {Lang('photolibrary-list.collection_abort', this.props.lang)}
      </a>
    );
  }

  makeForm() {
    const collection = this.props.collection;

    if (!collection.editing) {
      return null;
    }

    const props = {
      disabled: collection.loading ? { disabled: true } : {},
      type: 'text',
      ref: this.setRefInput,
      defaultValue: collection.name_edit,
    };

    return (
      <form className="photolibrary__collection-editor" onSubmit={this.onCollectionUpdate}>
        <input {...props} />
      </form>
    );
  }

  makeRemove() {
    const collection = this.props.collection;

    if (parseInt(collection.id, 10) <= 0 || collection.editing || collection.loading) {
      return null;
    }

    if (collection.deleted) {
      return null;
    }

    return (
      <a className="photolibrary__collection-delete" onClick={this.onCollectionDelete}>
        {Lang('photolibrary-list.collection_delete', this.props.lang)}
      </a>
    );
  }

  makeRestore() {
    const collection = this.props.collection;

    if (parseInt(collection.id, 10) <= 0 || collection.editing || collection.loading) {
      return null;
    }

    if (!collection.deleted) {
      return null;
    }

    return (
      <a className="photolibrary__collection-restore" onClick={this.onCollectionRestore}>
        {Lang('photolibrary-list.collection_restore', this.props.lang)}
      </a>
    );
  }

  makeLoader() {
    if (!this.props.collection.loading) {
      return null;
    }

    return <div className="photolibrary__collection-loader"><Loader type="small" /></div>;
  }

  render() {
    const props = {
      className: 'photolibrary__collection',
      style: {},
      onClick: this.onCollectionSelect,
    };

    const collection = this.props.collection;

    if (collection.deleted) {
      props.className += ' photolibrary__collection--deleted';
    }

    if (collection.cover) {
      props.style.backgroundImage = `url('${collection.cover}')`;
    }

    return (
      <div className="photolibrary__collection-wrapper">
        <div {...props}>
          {this.makePhotos()}
          {this.makeName()}
          {this.makeForm()}
          {this.makeAbort()}
          {this.makeEdit()}
          {this.makeRemove()}
          {this.makeRestore()}
          {this.makeLoader()}
        </div>
      </div>
    );
  }
}

PhotoLibraryCollection.propTypes = propTypes;
PhotoLibraryCollection.defaultProps = defaultProps;

export default PhotoLibraryCollection;
