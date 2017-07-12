'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Block } from 'components/ui';
import { Link } from 'react-router';
import TagsCloud from 'components/tags-cloud';
import PopupWindow from 'components/popup-window';
import LocationPicker from 'components/location-picker';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('photostream-photo', langRu, 'ru');
Lang.updateLang('photostream-photo', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  photo: PropTypes.object.isRequired,
};

class PhotoMeta extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show_location: false,
    };

    this.showLocationPopup = this.showLocationPopup.bind(this);
    this.hideLocationPopup = this.hideLocationPopup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.photo.id !== nextProps.photo.id) {
      this.hideLocationPopup();
    }
  }

  showLocationPopup() {
    this.setState({ show_location: true });
  }

  hideLocationPopup() {
    this.setState({ show_location: false });
  }

  makeMeta() {
    const photo = this.props.photo;
    const tags = photo.tags || {};
    const ret = [];

    const details = {
      camera: tags.camera,
      lens: tags.lens,
      info: [],
    };

    ['shutter_speed', 'aperture', 'iso'].forEach((key) => {
      if (!tags[key]) return;

      details.info.push(Lang(
        `photostream-photo.photo_${key}`, {
          param: tags[key],
        }
      ));
    });

    details.info = details.info.join(', ');

    Object.keys(details).forEach((key) => {
      if (!details[key]) return;

      let content = details[key];

      if (key === 'camera' || key === 'lens') {
        content = (
          <Link to={`/${this.props.lang}/photostream/?tag=${encodeURIComponent(details[key])}`}>
            {details[key]}
          </Link>
        );
      }

      ret.push(
        <div key={key} className={`photo-meta__tag photo-meta__tag--${key}`}>
          {content}
        </div>
      );
    });

    if (!ret.length) return null;

    return <Block>{ret}</Block>;
  }

  makeTags() {
    const photo = this.props.photo;
    const category = photo.tags.category || '';
    const tags = {};

    category.split(',').forEach((tag) => {
      tag = tag.trim();
      if (tag) tags[tag] = 1;
    });

    if (Object.keys(tags).length <= 0) {
      return null;
    }

    return (
      <Block>
        <TagsCloud
          group="photostream"
          tags={tags}
          tagUrl={`/${this.props.lang}/photostream/?tag=%tag%`}
        />
      </Block>
    );
  }

  makeLocation() {
    if (!this.props.photo.gps) {
      return null;
    }

    return (
      <Block>
        <LocationPicker
          location={this.props.photo.gps}
          showControls={false}
          onClick={this.showLocationPopup}
          height="150px"
        />
      </Block>
    );
  }

  makeLocationPopup() {
    if (!this.state.show_location) {
      return null;
    }

    return (
      <PopupWindow onClose={this.hideLocationPopup}>
        <LocationPicker
          location={this.props.photo.gps}
          showControls={false}
          className="photo-meta__location-popup"
        />
      </PopupWindow>
    );
  }

  render() {
    return (
      <div>
        {this.makeMeta()}
        {this.makeTags()}
        {this.makeLocation()}
        {this.makeLocationPopup()}
      </div>
    );
  }
}

PhotoMeta.propTypes = propTypes;

export default PhotoMeta;
