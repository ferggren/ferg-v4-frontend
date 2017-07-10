'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import { Block, Grid, GridItem, FormButton, FormInputText, FormInputSelect } from 'components/ui';
import TagsSelector from 'components/tags-selector';
import deepClone from 'libs/deep-clone';
import Lang from 'libs/lang';
import PhotoLibrarySeparator from './separator';

const TAGS_WIDTH = '200px';

const propTypes = {
  photo: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  tags: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const defaultProps = {

};

class PhotoLibraryEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    const photo = props.photo;
    const tags = photo.tags;

    this.state = {
      tags: {
        iso: tags.iso,
        aperture: tags.aperture,
        shutter_speed: tags.shutter_speed,
        camera: tags.camera,
        lens: tags.lens,
        category: tags.category,
        location: tags.location,
        fl: tags.fl,
        efl: tags.efl,
      },
      collection_id: photo.collection_id,
      title_ru: photo.title_ru,
      title_en: photo.title_en,
      gps: photo.gps,
      taken: photo.taken,
    };

    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onTagSelect = this.onTagSelect.bind(this);
  }

  onChange(value, name) {
    const state = deepClone(this.state);

    if (name === 'collection_id') {
      value = parseInt(value, 10);
    }
    
    state[name] = value;
    this.setState(state);
  }

  onUpdate() {
    if (this.props.loading) {
      return;
    }

    const info = {
      collection: this.state.collection_id,
      title_ru: this.state.title_ru,
      title_en: this.state.title_en,
      gps: this.state.gps,
      taken: this.state.taken,
      tags: this.state.tags,
    };

    this.props.onUpdate(this.props.photo, info);
  }

  onTagSelect(tag, value) {
    if (this.props.loading) {
      return;
    }

    const tags = deepClone(this.state.tags);
    tags[tag] = value;

    this.setState({ tags });
  }

  makeError() {
    if (!this.props.error) {
      return null;
    }

    return <Block>{this.props.error}</Block>;
  }

  makeLoader() {
    if (!this.props.loading) {
      return null;
    }

    return <Block><Loader /></Block>;
  }

  makeTags() {
    const ret = [];

    Object.keys(this.props.tags).forEach((tag) => {
      if (ret.length) {
        ret.push(<PhotoLibrarySeparator key={`${tag}_spacing`} />);
      }

      ret.push(
        <TagsSelector
          key={`${tag}_selector`}
          tag={tag}
          name={Lang(`photolibrary.tag_${tag}`)}
          value={this.state.tags[tag]}
          values={Object.keys(this.props.tags[tag])}
          multiple={tag === 'category'}
          onSelect={this.onTagSelect}
        />
      );
    });

    return ret;
  }

  makeButton() {
    if (this.props.loading) {
      return null;
    }

    return (
      <Block>
        <FormButton onClick={this.onUpdate}>
          {Lang('photolibrary.photo_update', this.props.lang)}
        </FormButton>
      </Block>
    );
  }

  makeCollectionSelect() {
    const values = [];

    this.props.collections.forEach((collection) => {
      if (collection.id < 0) {
        return;
      }

      values.push({ text: collection.name, value: parseInt(collection.id, 10) });
    });

    if (!values.length) {
      return null;
    }

    return (
      <Block>
        <FormInputSelect
          name="collection_id"
          value={parseInt(this.state.collection_id, 10)}
          values={values}
          disabled={this.props.loading}
          onChange={this.onChange}
        />
      </Block>
    );
  }

  render() {
    const coverProps = {
      className: 'photolibrary__editor-cover',
      style: {
        backgroundImage: `url('${this.props.photo.preview}')`,
      },
    };

    return (
      <div className="photolibrary__editor">
        <div {...coverProps} />
        {this.makeError()}

        <Block>
          <Grid justifyContent="space-between">
            <GridItem width={`calc(100% - ${TAGS_WIDTH} - 30px)`}>
              {this.makeLoader()}

              <Block>
                <FormInputText
                  type="text"
                  name="title_ru"
                  value={this.state.title_ru}
                  placeholder={Lang('photolibrary.photo_title_ru')}
                  disabled={this.props.loading}
                  onChange={this.onChange}
                />
              </Block>

              <Block>
                <FormInputText
                  type="text"
                  name="title_en"
                  value={this.state.title_en}
                  placeholder={Lang('photolibrary.photo_title_en')}
                  disabled={this.props.loading}
                  onChange={this.onChange}
                />
              </Block>

              <Block>
                <FormInputText
                  type="text"
                  name="gps"
                  value={this.state.gps}
                  placeholder={Lang('photolibrary.photo_gps')}
                  disabled={this.props.loading}
                  onChange={this.onChange}
                />
              </Block>

              <Block>
                <FormInputText
                  type="text"
                  name="taken"
                  value={this.state.taken}
                  placeholder={Lang('photolibrary.photo_taken')}
                  disabled={this.props.loading}
                  onChange={this.onChange}
                />
              </Block>

              {this.makeCollectionSelect()}
              {this.makeButton()}
            </GridItem>

            <GridItem width={TAGS_WIDTH}>
              {this.makeTags()}
            </GridItem>
          </Grid>
        </Block>
      </div>
    );
  }
}

PhotoLibraryEditor.propTypes = propTypes;
PhotoLibraryEditor.defaultProps = defaultProps;

export default PhotoLibraryEditor;
