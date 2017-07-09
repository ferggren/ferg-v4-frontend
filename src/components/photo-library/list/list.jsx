'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import deepClone from 'libs/deep-clone';
import Lang from 'libs/lang';
import Request from 'libs/request';
import PhotoLibraryEditor from 'components/photo-library/editor';
import './styles';

const propTypes = {
  onSelect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  onUpload: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  lang: PropTypes.string.isRequired,
};

const defaultProps = {
  onSelect: false,
  onUpload: false,
};

class PhotoLibraryList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      loading: false,
      collections: [],
      collection: 0,
      page: 1,
      pages: 1,
      selected: {},
      tags: {},
      tags_selected: {},
      editor_photo_id: 0,
    };

    this.requests = {};

    this.selectCollection = this.selectCollection.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.loadPhotos = this.loadPhotos.bind(this);
    this.loadTags = this.loadTags.bind(this);
    this.loadCollections = this.loadCollections.bind(this);
  }

  componentDidMount() {
    this.loadPhotos();
    this.loadTags();
    this.loadCollections();
  }

  componentWillUnmount() {
    Object.keys(this.requests).forEach((request) => {
      Request.abort(this.requests[request]);
      this.requests[request] = false;
    });

    this.requests = {};
  }

  setPhotoSelected(photo) {
    const selected = deepClone(this.state.selected);
    selected[photo.id] = true;

    this.setState({ selected });
  }

  setPhotoUnselected(photo) {
    const selected = deepClone(this.state.selected);

    if (selected[photo.id] !== undefined) {
      selected[photo.id] = null;
      delete selected[photo.id];
    }

    this.setState({ selected });
  }

  selectPage(page) {
    this.setState({ page }, this.loadPhotos);
  }

  updateCollection(collection, collection_name) {
    if (collection.id === -1) {
      this.createCollection(collection, collection_name);
      return;
    }

    const collections = deepClone(this.state.collections);
    const c = collections.find((e) => { return e.id === collection.id; });
    const request = `ce_${collection.id}`;

    if (!c) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    c.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/updateCollection', {
        method: 'POST',

        success: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
            c_edited.editing = false;
            c_edited.name = collection_name;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },

        error: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },

        data: {
          name: collection_name,
          id: collection.id,
        },
      }
    );

    this.setState({ collections });
  }

  createCollection(collection, collection_name) {
    const collections = deepClone(this.state.collections);
    const c = collections.find((e) => { return e.id === collection.id; });
    const request = `cc_${collection.id}`;

    if (!c) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    c.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/createCollection', {
        method: 'POST',

        success: (new_collection) => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
            c_edited.editing = false;
          }

          collections_edited.push(new_collection);

          collections_edited.sort((a, b) => {
            return parseInt(b.updated, 10) - parseInt(a.updated, 10);
          });

          this.setState({ collections: collections_edited });
          this.selectCollection(new_collection);

          this.requests[request] = null;
          delete this.requests[request];
        },

        error: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },

        data: { name: collection_name },
      }
    );

    this.setState({ collections });
  }

  deleteCollection(collection) {
    const collections = deepClone(this.state.collections);
    const c = collections.find((e) => { return e.id === collection.id; });
    const request = `cd_${collection.id}`;

    if (!c) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    c.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/deleteCollection', {
        method: 'POST',

        success: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
            c_edited.deleted = true;
          }

          if (collection.id === this.state.collection) {
            this.setCollection(collection);
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },

        error: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },
        data: { id: collection.id },
      }
    );

    this.setState({ collections });
  }

  restoreCollection(collection) {
    const collections = deepClone(this.state.collections);
    const c = collections.find((e) => { return e.id === collection.id; });
    const request = `cr_${collection.id}`;

    if (!c) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    c.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/restoreCollection', {
        method: 'POST',

        success: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
            c_edited.deleted = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },

        error: () => {
          const collections_edited = deepClone(this.state.collections);
          const c_edited = collections_edited.find((e) => { return e.id === collection.id; });

          if (c_edited) {
            c_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ collections: collections_edited });
        },
        data: { id: collection.id },
      }
    );

    this.setState({ collections });
  }

  updateCollectionStats(update) {
    let updated = false;

    if (typeof update !== 'object') {
      return;
    }

    const collections = deepClone(this.state.collections);

    collections.forEach((collection) => {
      if (collection.id !== update.id) {
        return;
      }

      collection.photos = update.photos;
      collection.cover = update.cover;
      collection.updated = update.updated;

      updated = true;
    });

    if (!updated) {
      return;
    }

    collections.sort((a, b) => {
      return parseInt(b.updated, 10) - parseInt(a.updated, 10);
    });

    this.setState({ collections });
  }

  loadPhotos() {
    if (this.requests.lp) {
      Request.abort(this.requests.lp);
    }

    this.setState({ loading: true });

    const data = {
      collection: this.state.collection ? this.state.collection : '',
      page: this.state.page,
    };

    Object.keys(this.state.tags_selected).forEach((tag) => {
      data[`tag_${tag}`] = this.state.tags_selected[tag];
      data.tags = true;
    });

    this.requests.lp = Request.fetch(
      '/api/photolibrary/getPhotos/', {
        method: 'POST',

        success: (response) => {
          this.setState({
            page: response.page,
            pages: response.pages,
            photos: response.photos,
            loading: false,
          });

          this.requests.lp = null;
          delete this.requests.lp;
        },

        error: () => {
          this.setState({ loading: false });
          this.requests.lp = null;
          delete this.requests.lp;
        },

        data,
      }
    );
  }

  createNewPhoto(photo) {
    const request_id = Request.fetch(
      '/api/photolibrary/addPhoto', {
        method: 'POST',

        success: (response) => {
          this.addPhoto(response.photo);

          if (response && response.collection) {
            this.updateCollectionStats(response.collection);
          }

          this.requests[request_id] = null;
          delete this.requests[request_id];
        },

        error: () => {
          this.requests[request_id] = null;
          delete this.requests[request_id];
        },

        data: {
          file_id: photo.id,
          collection: this.state.collection ? this.state.collection : 0,
        },
      }
    );

    this.requests[request_id] = request_id;
  }

  addPhoto(photo) {
    if (this.state.page !== 1) {
      return;
    }

    if (this.state.collection !== photo.collection_id) {
      return;
    }

    const photos = deepClone(this.state.photos);
    photos.unshift(photo);

    this.setState({ photos });
  }

  toggleEditCollection(collection) {
    const collections = deepClone(this.state.collections);
    const c = collections.find((e) => { return e.id === collection.id; });

    if (c) {
      c.editing = !c.editing;
      c.name_edit = c.id === -1 ? '' : c.name;
    }

    this.setState({ collections });
  }

  selectCollection(collection) {
    if (typeof collection !== 'object') {
      let found = false;
      collection = parseInt(collection, 10);

      this.state.collections.forEach((c) => {
        if (c.id !== collection) {
          return;
        }

        found = true;
        collection = c;
      });

      if (!found) {
        return;
      }
    }

    if (collection.id === this.state.collection) {
      return;
    }

    if (collection.id === -1) {
      this.toggleEditCollection(collection);
      return;
    }

    this.setState({
      collection: collection.deleted ? 0 : collection.id,
      page: 1,
      pages: 1,
      tags_selected: {},
    }, () => {
      this.loadPhotos();
      this.loadTags();
    });
  }

  selectTag(tag, value) {
    const tags = deepClone(this.state.tags_selected);

    if (typeof tags[tag] !== 'undefined' && tags[tag] === value) {
      tags[tag] = null;
      delete tags[tag];
    } else {
      tags[tag] = value;
    }

    this.setState({ tags_selected: tags }, this.loadPhotos);
  }

  loadTags() {
    const collection = this.state.collection;
    const request = `tags_${collection}`;

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    this.requests[request] = Request.fetch(
      '/api/photolibrary/getTags/', {
        method: 'POST',

        success: (collection_tags) => {
          const tags = deepClone(this.state.tags);
          tags[collection] = collection_tags;
          this.setState({ tags });

          this.requests[request] = null;
          delete this.requests[request];
        },

        error: () => {
          this.requests[request] = null;
          delete this.requests[request];
        },

        data: { collection },
      }
    );
  }

  loadCollections() {
    if (this.requests.lc) {
      Request.abort(this.requests.lc);
      delete this.requests.lc;
    }

    this.requests.lc = Request.fetch(
      '/api/photolibrary/getCollections/', {
        method: 'POST',

        success: (collections) => {
          collections.sort((a, b) => {
            return parseInt(b.updated, 10) - parseInt(a.updated, 10);
          });

          collections.push({
            id: -1,
            name: Lang('photolibrary.collection_add', this.props.lang),
            updated: 0,
          });

          collections.push({
            id: 0,
            name: Lang('photolibrary.photos_all', this.props.lang),
            updated: 0,
          });

          this.setState({ collections });

          this.requests.lc = null;
          delete this.requests.lc;
        },

        error: () => {
          this.requests.lc = null;
          delete this.requests.lc;
        },
      }
    );
  }

  deletePhoto(deleted_photo) {
    const request = `pd_${deleted_photo.id}`;
    const selected = deepClone(this.state.selected);
    const photos = deepClone(this.state.photos);
    const photo = photos.find((e) => { return e.id === deleted_photo.id; });

    if (!photo) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    if (selected[photo.id] !== undefined) {
      selected[photo.id] = null;
      delete selected[photo.id];
    }

    photo.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/deletePhoto', {
        method: 'POST',

        success: (response) => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === deleted_photo.id; });

          if (p_edited) {
            p_edited.loading = false;
            p_edited.deleted = true;
          }

          if (response && response.collection) {
            this.updateCollectionStats(response.collection);
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ photos: photos_edited });
        },

        error: () => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === deleted_photo.id; });

          if (p_edited) {
            p_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ photos: photos_edited });
        },

        data: { photo_id: photo.id },
      }
    );

    this.setState({ photos, selected });
  }

  restorePhoto(deleted_photo) {
    const request = `pr_${deleted_photo.id}`;
    const selected = deepClone(this.state.selected);
    const photos = deepClone(this.state.photos);
    const photo = photos.find((e) => { return e.id === deleted_photo.id; });

    if (!photo) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    if (selected[photo.id] !== undefined) {
      selected[photo.id] = null;
      delete selected[photo.id];
    }

    photo.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/restorePhoto', {
        method: 'POST',

        success: (response) => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === deleted_photo.id; });

          if (p_edited) {
            p_edited.loading = false;
            p_edited.deleted = false;
          }

          if (response && response.collection) {
            this.updateCollectionStats(response.collection);
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ photos: photos_edited });
        },

        error: () => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === deleted_photo.id; });

          if (p_edited) {
            p_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({ photos: photos_edited });
        },

        data: { photo_id: photo.id },
      }
    );

    this.setState({ photos, selected });
  }

  selectPhoto(photo) {
    if (photo.deleted) {
      return;
    }

    if (!this.props.onSelect) {
      return;
    }

    this.props.onSelect([photo.id]);
  }

  attachSelectedPhotos() {
    const photos = Object.keys(this.state.selected);

    if (!photos.length) {
      return;
    }

    if (!this.props.onSelect) {
      return;
    }

    this.props.onSelect(photos);
  }

  clearSelectedPhotos() {
    this.setState({ selected: {} });
  }

  editPhoto(photo) {
    console.log('edit', photo);
  }

  render() {
    console.log(this.state);

    return (
      <div>
        PhotoLibraryList OMG
      </div>
    );
  }
}

PhotoLibraryList.propTypes = propTypes;
PhotoLibraryList.defaultProps = defaultProps;

export default PhotoLibraryList;
