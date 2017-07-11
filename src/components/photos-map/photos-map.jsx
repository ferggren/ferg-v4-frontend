'use strict';

/* global google */

import React from 'react';
import PropTypes from 'prop-types';
import gooleMapStyle from 'data/google-map-style';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('photos-map', langRu, 'ru');
Lang.updateLang('photos-map', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  photos: PropTypes.array,
  heightSmall: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  heightFull: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const defaultProps = {
  photos: [],
  heightSmall: '30vh',
  heightFull: '100vh',
};

class PhotosMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      change_zoom: true,
      expanded: false,
    };
    
    this.map = false;
    this.ref_map = false;
    this.watch_google_loaded = false;
    this.watch_container_size = false;
    this.last_container_w = false;
    this.last_container_h = false;

    this.checkContainerSize = this.checkContainerSize.bind(this);
    this.setRefMap = this.setRefMap.bind(this);
    this.initMap = this.initMap.bind(this);
    this.checkZoomOnBounds = this.checkZoomOnBounds.bind(this);
    this.photos = {};
  }

  componentDidMount() {
    this.initMap();
    this.updateContainerSize();
    this.updatePhotos();
    this.updateBoundsLock();

    window.addEventListener('resize', this.checkContainerSize);
    this.watch_container_size = setInterval(this.checkContainerSize, 1000);

    setTimeout(this.checkZoomOnBounds, 1000);
  }

  componentDidUpdate() {
    this.updatePhotos();
    this.updateBoundsLock();
  }

  componentWillUnmount() {
    if (this.watch_container_size) {
      clearInterval(this.watch_container_size);
      this.watch_container_size = false;
    }

    window.removeEventListener('resize', this.checkContainerSize);
    this.ref_map = false;

    if (this.map) {
      google.maps.event.clearListeners(this.map, 'tilesloaded');
      google.maps.event.clearListeners(this.map, 'dragstart');

      this.map = null;
    }

    if (this.watch_google_loaded) {
      clearTimeout(this.watch_google_loaded);
      this.watch_google_loaded = false;
    }
  }

  setRefMap(c) {
    this.ref_map = c;
  }

  checkZoomOnBounds() {
    if (!this.map) return;

    if (this.map.getZoom() > 17) this.map.setZoom(17);
    if (this.map.getZoom() < 3) this.map.setZoom(3);
  }

  checkContainerSize() {
    if (!this.ref_map) return;

    const map_width = this.ref_map.offsetWidth;
    const map_height = this.ref_map.offsetHeight;

    if (map_width === this.last_container_w &&
        map_height === this.last_container_h) {
      return;
    }

    this.last_container_w = map_width;
    this.last_container_h = map_height;

    google.maps.event.trigger(this.map, 'resize');
  }

  initMap() {
    if (this.map) return;

    if (typeof window.google === 'undefined' || !this.ref_map) {
      this.watch_google_loaded = setTimeout(this.initMap, 100);
      return;
    }

    const styledMapType = new google.maps.StyledMapType(gooleMapStyle);

    this.map = new google.maps.Map(this.ref_map, {
      clickableIcons: false,
      disableDefaultUI: true,
      center: { lat: 55.014578, lng: 82.919764 },
      zoom: 4,
      mapTypeControlOptions: {
        mapTypeIds: [
          'roadmap',
          'satellite',
          'hybrid',
          'terrain',
          'styled_map',
        ],
      },
    });

    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');

    this.map.addListener('tilesloaded', () => {
      google.maps.event.clearListeners(this.map, 'tilesloaded');

      this.updateContainerSize();
      this.updatePhotos();
      this.updateBoundsLock();
    });

    this.updateContainerSize();
    this.updatePhotos();
    this.updateBoundsLock();
  }

  updatePhotos() {
    if (!this.map) {
      return;
    }

    console.log('update photos');
  }

  updateBoundsLock() {
    if (!this.map) return;

    console.log('update bounds lock');
  }

  updateContainerSize() {
    if (!this.map) return;
    google.maps.event.trigger(this.map, 'resize');
  }

  render() {
    const props = {
      className: 'photos-map ferg-transparent-navigation',
      ref: this.setRefMap,
      style: {},
    };

    if (this.state.expanded) {
      props.style.height = this.props.heightFull;
    } else {
      props.style.height = this.props.heightSmall;
    }

    return <div {...props} />;
  }
}

PhotosMap.propTypes = propTypes;
PhotosMap.defaultProps = defaultProps;

export default PhotosMap;
