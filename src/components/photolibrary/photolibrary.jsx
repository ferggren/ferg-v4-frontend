'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import deepClone from 'libs/deep-clone';
import Lang from 'libs/lang';
import Request from 'libs/request';
import Loader from 'components/loader';
import Storage from 'components/storage';
import { Block, Grid, GridItem } from 'components/ui';
import Paginator from 'components/paginator';
import PhotoLibraryCollections from './components/collections';
import PhotoLibraryCover from './components/cover';
import PhotoLibraryTags from './components/tags';
import PhotoLibraryAttachButton from './components/attach-button';
import PhotoLibrarySeparator from './components/separator';
import PhotoLibraryPhoto from './components/photo';
import PhotoLibraryEditor from './components/editor';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

const TAGS_WIDTH = '200px';

Lang.updateLang('photolibrary', langRu, 'ru');
Lang.updateLang('photolibrary', langEn, 'en');

const propTypes = {
  onSelect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  lang: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
};

const defaultProps = {
  onSelect: false,
  multiple: false,
};

class PhotoLibrary extends React.PureComponent {
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
      editor_photo: 0,
      editor_loading: false,
      editor_error: false,
    };

    this.requests = {};

    this.selectCollection = this.selectCollection.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.loadPhotos = this.loadPhotos.bind(this);
    this.loadTags = this.loadTags.bind(this);
    this.loadCollections = this.loadCollections.bind(this);
    this.createNewPhoto = this.createNewPhoto.bind(this);
    this.clearSelectedPhotos = this.clearSelectedPhotos.bind(this);
    this.attachSelectedPhotos = this.attachSelectedPhotos.bind(this);
    this.toggleEditCollection = this.toggleEditCollection.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.restoreCollection = this.restoreCollection.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.restorePhoto = this.restorePhoto.bind(this);
    this.setPhotoSelected = this.setPhotoSelected.bind(this);
    this.setPhotoUnselected = this.setPhotoUnselected.bind(this);
    this.editPhoto = this.editPhoto.bind(this);
    this.abortEditPhoto = this.abortEditPhoto.bind(this);
    this.selectPhoto = this.selectPhoto.bind(this);
    this.updatePhoto = this.updatePhoto.bind(this);
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

    this.setState({ loading: true, photos: {} });

    const data = {
      collection: this.state.collection ? this.state.collection : '',
      page: this.state.page,
    };

    Object.keys(this.state.tags_selected).forEach((group) => {
      data[`tag_${group}`] = this.state.tags_selected[group];
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

  selectCollection(collection = 0) {
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

  selectTag(tag, group) {
    const tags = deepClone(this.state.tags_selected);

    if (typeof tags[group] !== 'undefined' && tags[group] === tag) {
      tags[group] = null;
      delete tags[group];
    } else {
      tags[group] = tag;
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

  updatePhoto(photo, info) {
    const request = `update_${photo.id}`;
    const photos = deepClone(this.state.photos);
    const p = photos.find((e) => { return e.id === photo.id; });

    if (!p) {
      return;
    }

    if (this.requests[request]) {
      Request.abort(this.requests[request]);
    }

    photo.loading = true;

    this.requests[request] = Request.fetch(
      '/api/photolibrary/updatePhoto', {
        method: 'POST',

        success: (response) => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === photo.id; });

          if (p_edited) {
            p_edited.loading = false;
            p_edited.title_ru = info.title_ru;
            p_edited.title_en = info.title_en;
            p_edited.gps = info.gps;
            p_edited.taken = info.taken;
            p_edited.collection_id = info.collection;

            p_edited.tags.aperture = info.tags.aperture;
            p_edited.tags.shutter_speed = info.tags.shutter_speed;
            p_edited.tags.camera = info.tags.camera;
            p_edited.tags.lens = info.tags.lens;
            p_edited.tags.iso = info.tags.iso;
            p_edited.tags.category = info.tags.category;
            p_edited.tags.fl = info.tags.fl;
            p_edited.tags.efl = info.tags.efl;
            p_edited.tags.location = info.tags.location;
          }

          const tags = deepClone(this.state.tags);
          tags[response.collection] = response.tags;

          this.requests[request] = null;
          delete this.requests[request];

          if (photo.collection_id === info.collection) {
            this.setState({
              photos: photos_edited,
              editor_loading: false,
              editor_photo: false,
              tags,
            });
          } else {
            this.setState({
              photos: photos_edited,
              editor_loading: false,
              editor_photo: false,
              tags,
            }, () => {
              this.loadPhotos();
              this.loadCollections();
            });
          }
        },

        error: (error) => {
          const photos_edited = deepClone(this.state.photos);
          const p_edited = photos_edited.find((e) => { return e.id === photo.id; });

          if (p_edited) {
            p_edited.loading = false;
          }

          this.requests[request] = null;
          delete this.requests[request];

          this.setState({
            photos: photos_edited,
            editor_loading: false,
            editor_error: Lang(`photolibrary.${error}`, this.props.lang),
          });
        },

        data: {
          id: photo.id,
          title_ru: info.title_ru,
          title_en: info.title_en,
          gps: info.gps,
          taken: info.taken,
          iso: info.tags.iso,
          shutter_speed: info.tags.shutter_speed,
          aperture: info.tags.aperture,
          camera: info.tags.camera,
          lens: info.tags.lens,
          category: info.tags.category,
          fl: info.tags.fl,
          efl: info.tags.efl,
          location: info.tags.location,
          photo_collection: info.collection,
          tags_collection: this.state.collection,
        },
      }
    );

    this.setState({
      photos,
      editor_loading: true,
      editor_error: false,
    });
  }

  selectPhoto(photo) {
    if (photo.deleted) {
      return;
    }

    if (this.props.multiple) {
      if (this.state.selected[photo.id]) {
        this.setPhotoUnselected(photo);
      } else {
        this.setPhotoSelected(photo);
      }
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
    this.setState({ editor_photo: photo.id });
  }

  abortEditPhoto() {
    this.setState({ editor_photo: false });
  }

  makeCollections() {
    if (this.state.collection) return null;

    return (
      <Block>
        <PhotoLibraryCollections
          collections={this.state.collections}
          default_collections={[0, -1]}
          onCollectionSelect={this.selectCollection}
          onCollectionEdit={this.toggleEditCollection}
          onCollectionEditCancel={this.toggleEditCollection}
          onCollectionUpdate={this.updateCollection}
          onCollectionDelete={this.deleteCollection}
          onCollectionRestore={this.restoreCollection}
          lang={this.props.lang}
        />
      </Block>
    );
  }

  makeCover() {
    if (this.state.collection <= 0) {
      return null;
    }

    const collection = this.state.collections.find((e) => {
      return e.id === this.state.collection;
    });

    if (!collection) {
      return null;
    }

    return (
      <Block>
        <PhotoLibraryCover
          collection={collection}
          onBack={this.selectCollection}
          lang={this.props.lang}
        />
      </Block>
    );
  }

  makePhotos() {
    if (!this.state.photos.length) {
      if (this.state.loading) {
        return null;
      }

      return <Block>{Lang('photolibrary.photos_not_found', this.props.lang)}</Block>;
    }

    const ret = this.state.photos.map((photo) => {
      return (
        <PhotoLibraryPhoto
          key={photo.id}
          photo={photo}
          lang={this.props.lang}
          multiselect={this.props.multiple}
          selected={typeof this.state.selected[photo.id] !== 'undefined'}
          onPhotoDelete={this.deletePhoto}
          onPhotoRestore={this.restorePhoto}
          onPhotoSelect={this.setPhotoSelected}
          onPhotoUnselect={this.setPhotoUnselected}
          onPhotoEdit={this.editPhoto}
          onPhotoClick={this.selectPhoto}
        />
      );
    });

    return (
      <Block>
        <div className="photolibrary__photos">
          {ret}
          <div className="photolibrary__photos-clear" />
        </div>
      </Block>
    );
  }

  makeLoader() {
    if (!this.state.loading) return null;

    return <Block><Loader /></Block>;
  }

  makePaginator() {
    if (this.state.loading) return null;

    return (
      <Block>
        <Paginator
          page={this.state.page}
          pages={this.state.pages}
          onSelect={this.selectPage}
        />
      </Block>
    );
  }

  makeButton() {
    if (this.state.loading) return null;

    const selected = Object.keys(this.state.selected).length;

    if (!selected) return null;

    return (
      <Block>
        <PhotoLibraryAttachButton
          onAbort={this.clearSelectedPhotos}
          onAttach={this.attachSelectedPhotos}
          selected={selected}
          lang={this.props.lang}
        />
      </Block>
    );
  }

  makeEditor() {
    if (!this.state.editor_photo || !this.state.tags[0]) {
      return null;
    }

    const photo = this.state.photos.find((e) => {
      return e.id === this.state.editor_photo;
    });

    if (!photo) {
      return null;
    }

    return (
      <PhotoLibraryEditor
        photo={photo}
        loading={this.state.editor_loading}
        error={this.state.editor_error}
        tags={this.state.tags[0]}
        collections={this.state.collections}
        lang={this.props.lang}
        onClose={this.abortEditPhoto}
        onUpdate={this.updatePhoto}
      />
    );
  }

  render() {
    return (
      <Block>
        {this.makeEditor()}

        <Grid justifyContent="space-between">
          <GridItem width={`calc(100% - ${TAGS_WIDTH} - 30px)`}>
            <Block>
              <Storage 
                onFileUpload={this.createNewPhoto}
                mediaTypes="image"
                group="photolibrary"
                mode="uploader"
                upload_access="private"
                lang={this.props.lang}
              />
            </Block>

            {this.makeCollections()}
            {this.makeCover()}
            <Block><PhotoLibrarySeparator /></Block>
            {this.makePhotos()}
            {this.makeLoader()}
            {this.makePaginator()}
            {this.makeButton()}
          </GridItem>

          <GridItem width={TAGS_WIDTH}>
            <PhotoLibraryTags
              onTagSelect={this.selectTag}
              tags={this.state.tags[this.state.collection] || false}
              selected={this.state.tags_selected}
            />
          </GridItem>
        </Grid>
      </Block>
    );
  }
}

PhotoLibrary.propTypes = propTypes;
PhotoLibrary.defaultProps = defaultProps;

export default PhotoLibrary;
