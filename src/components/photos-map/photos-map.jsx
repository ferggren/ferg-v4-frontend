'use strict';

/* global google */

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import gooleMapStyle from 'data/google-map-style';
import Lang from 'libs/lang';
import { browserHistory } from 'react-router';
import objectsCmp from 'libs/objects-cmp';
import createMarker from './components/marker';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('photos-map', langRu, 'ru');
Lang.updateLang('photos-map', langEn, 'en');

const propTypes = {
  loading: PropTypes.bool,
  tag: PropTypes.string,
  lang: PropTypes.string.isRequired,
  markers: PropTypes.array.isRequired,
  expandable: PropTypes.bool,
  heightSmall: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  heightFull: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onTagSelect: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  tag: '',
  loading: false,
  expandable: true,
  heightSmall: '30vh',
  heightFull: '100vh',
  onTagSelect: false,
};

class PhotosMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      change_zoom: true,
      expanded: false,
      zoom: 4,
      locked: true,
    };
    
    this.map = false;
    this.ref_map = false;
    this.ref_container = false;
    this.watch_google_loaded = false;
    this.watch_container_size = false;
    this.resize_timer = false;
    this.watch_zoom = false;
    this.last_container_w = false;
    this.last_container_h = false;
    this.markers = {};

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleTilesLoaded = this.handleTilesLoaded.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.updateBounds = this.updateBounds.bind(this);

    this.checkContainerSize = this.checkContainerSize.bind(this);
    this.setRefMap = this.setRefMap.bind(this);
    this.setRefContainer = this.setRefContainer.bind(this);
    this.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    this.initMap();
    this.updateContainerSize();
    this.updateMarkers();

    window.addEventListener('resize', this.checkContainerSize);
    this.watch_container_size = setInterval(this.checkContainerSize, 1000);
    this.watch_zoom = setTimeout(this.handleZoomChanged, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.markers !== this.props.markers && objectsCmp(prevProps.markers, this.props.markers)) ||
        prevProps.tag !== this.props.tag) {
      if (!this.state.locked) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({ locked: true });
      }

      this.updateMarkers();
    } else if (prevState.zoom !== this.state.zoom) {
      this.updateMarkers();
    }

    if (prevState.locked !== this.state.locked) {
      this.updateBounds();
    }
  }

  componentWillUnmount() {
    if (this.watch_container_size) {
      clearInterval(this.watch_container_size);
      this.watch_container_size = false;
    }

    Object.keys(this.markers).forEach((key) => {
      this.removeMarker(key);
    });

    this.markers = {};

    window.removeEventListener('resize', this.checkContainerSize);

    this.ref_map = false;
    this.ref_container = false;

    if (this.map) {
      google.maps.event.clearListeners(this.map, 'tilesloaded');
      google.maps.event.clearListeners(this.map, 'dragstart');
      google.maps.event.clearListeners(this.map, 'zoom_changed');
      google.maps.event.clearListeners(this.map, 'resize');

      this.map = null;
    }

    if (this.watch_google_loaded) {
      clearTimeout(this.watch_google_loaded);
      this.watch_google_loaded = false;
    }

    if (this.watch_zoom) {
      clearTimeout(this.watch_zoom);
      this.watch_zoom = false;
    }

    if (this.resize_timer) {
      clearTimeout(this.resize_timer);
      this.resize_timer = false;
    }
  }

  setRefMap(c) {
    this.ref_map = c;
  }

  setRefContainer(c) {
    this.ref_container = c;
  }

  toggleExpand() {
    if (!this.props.expandable) {
      this.setState({ expanded: false });
      return;
    }

    this.setState({ expanded: !this.state.expanded });
  }

  handleResize() {
    if (this.resize_timer) {
      clearTimeout(this.resize_timer);
    }

    this.resize_timer = setTimeout(this.updateBounds, 500);
  }

  handleMarkerClick(e, info) {
    e.preventDefault();
    e.stopPropagation();

    if (info.display === 'group') {
      if (this.props.onTagSelect) {
        this.props.onTagSelect(info.loc);
      }

      return;
    }

    if (info.type === 'photostream') {
      console.log('photostream');
      return;
    }

    browserHistory.push(info.url);
  }

  handleZoomChanged() {
    const zoom = this.map.getZoom();

    if (zoom > 17) {
      this.map.setZoom(17);
      return;
    }

    if (zoom < 2) {
      this.map.setZoom(2);
      return;
    }

    if (zoom !== this.state.zoom) {
      this.setState({ zoom });
    }
  }

  handleTilesLoaded() {
    google.maps.event.clearListeners(this.map, 'tilesloaded');

    this.updateContainerSize();
    this.updateMarkers();
    this.updateBounds();
  }

  handleDragStart() {
    if (!this.state.locked) {
      return;
    }

    this.setState({ locked: false });
  }

  checkContainerSize() {
    if (!this.ref_container || !this.ref_map) {
      return;
    }

    const map_width = this.ref_container.offsetWidth;
    const map_height = this.ref_container.offsetHeight;

    if (map_width === this.last_container_w &&
        map_height === this.last_container_h) {
      return;
    }

    this.ref_map.style.width = `${map_width}px`;
    this.ref_map.style.height = `${map_height}px`;

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

    this.map.addListener('tilesloaded', this.handleTilesLoaded);
    this.map.addListener('dragstart', this.handleDragStart);
    this.map.addListener('zoom_changed', this.handleZoomChanged);
    this.map.addListener('resize', this.handleResize);

    this.updateContainerSize();
    this.updateMarkers();
    this.updateBounds();
  }

  updateMarkers() {
    if (!this.map) {
      return;
    }

    Object.keys(this.markers).forEach((key) => {
      this.markers[key].valid = false;
    });

    const list = this.makeMarkersList();

    Object.keys(list).forEach((key) => {
      if (this.markers[key]) {
        this.markers[key].valid = true;
        return;
      }

      this.addMarker(key, list[key]);
    });

    let found = false;

    Object.keys(this.markers).forEach((key) => {
      if (this.markers[key].valid) {
        found = true;
        return;
      }

      this.removeMarker(key);
    });

    if (!found) {
      console.log('not found');
    }

    this.updateBounds();
  }

  updateBounds() {
    if (!this.map || !this.state.locked) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    Object.keys(this.markers).forEach((key) => {
      const info = this.markers[key].info;

      bounds.extend({
        lat: info.lat,
        lng: info.lng,
      });
    });

    this.map.fitBounds(bounds);
    this.map.panTo(bounds.getCenter());
    this.map.panBy(0, -60);
  }

  updateContainerSize() {
    if (!this.map) return;
    google.maps.event.trigger(this.map, 'resize');
  }

  makeMarkersList(mode) {
    if (!mode) {
      mode = (this.state.zoom >= 11 || this.props.tag) ? 'single' : 'group';
    }

    const ret = {};
    const tag = this.props.tag ? this.props.tag.toLowerCase() : '';
    let found = false;

    this.props.markers.forEach((marker) => {
      const latlng = marker.gps.split(' ');

      if (latlng.length !== 2) {
        return;
      }

      if (tag && marker.tags.toLowerCase().indexOf(tag) === -1) {
        return;
      }

      found = true;
      let key = false;

      if (mode === 'single') {
        key = `s_${marker.id}`;
      } else {
        key = `g_${marker.loc}`;
      }

      if (mode === 'single' || !ret[key]) {
        ret[key] = {
          lat: parseFloat(latlng[0]) || 0,
          lng: parseFloat(latlng[1]) || 0,
          url: marker.url,
          loc: mode === 'group' ? marker.loc : false,
          display: mode,
          type: marker.type,
          id: marker.id,
          pics: [
            marker.pic,
          ],
        };

        return;
      }

      ret[key].pics.push(marker.pic);
    });

    if (!found && mode === 'single') {
      return this.makeMarkersList('group');
    }

    return ret;
  }

  addMarker(key, info) {
    const marker = createMarker(info, this.handleMarkerClick);
    marker.setMap(this.map);

    this.removeMarker(key);

    this.markers[key] = {
      marker,
      info,
      valid: true,
    };
  }

  removeMarker(key) {
    if (!this.markers[key]) {
      return;
    }

    this.markers[key].marker.setMap(null);
    this.markers[key] = null;
    delete this.markers[key];
  }

  makeShadow() {
    if (!this.props.loading) {
      return null;
    }

    return <div className="photos-map__shadow" />;
  }

  makeTagSelect() {
    return null;
  }

  makeLoader() {
    if (!this.props.loading) {
      return null;
    }

    return <div className="photos-map__loader"><Loader /></div>;
  }

  makeExpand() {
    if (!this.props.expandable) {
      return null;
    }

    return (
      <div className="photos-map__expand" onClick={this.toggleExpand}>
        {Lang(`photos-map.${this.state.expanded ? 'collapse' : 'expand'}`, this.props.lang)}
      </div>
    );
  }

  render() {
    const props = {
      className: 'photos-map__wrapper ferg-transparent-navigation',
      ref: this.setRefContainer,
      style: {},
    };

    if (this.state.expanded) {
      props.style.height = this.props.heightFull;
    } else {
      props.style.height = this.props.heightSmall;
    }

    return (
      <div {...props}>
        <div className="photos-map__map" ref={this.setRefMap} />
        {this.makeShadow()}
        {this.makeLoader()}
        {this.makeTagSelect()}
        {this.makeExpand()}
      </div>
    );
  }
}

PhotosMap.propTypes = propTypes;
PhotosMap.defaultProps = defaultProps;

export default PhotosMap;
