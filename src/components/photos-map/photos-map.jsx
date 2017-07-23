'use strict';

/* global google */

import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/loader';
import { openModal } from 'actions/modals';
import { connect } from 'react-redux';
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
  dispatch: PropTypes.func.isRequired,
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
  defaultLat: PropTypes.number,
  defaultLng: PropTypes.number,
  defaultZoom: PropTypes.number,
};

const defaultProps = {
  tag: '',
  loading: false,
  expandable: true,
  heightSmall: '30vh',
  heightFull: '100vh',
  onTagSelect: false,
  defaultLat: 55.014578,
  defaultLng: 82.919764,
  defaultZoom: 4,
};

class PhotosMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      expanded: false,
      zoom: props.defaultZoom,
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

    this.handleClearTag = this.handleClearTag.bind(this);
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
    this.updateMarkers();
    this.updateBounds();

    window.addEventListener('resize', this.checkContainerSize);
    this.watch_container_size = setInterval(this.checkContainerSize, 1000);
    this.watch_zoom = setTimeout(this.handleZoomChanged, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!objectsCmp(prevProps.markers, this.props.markers) ||
        prevProps.tag !== this.props.tag) {
      this.updateMarkers();
      this.updateBounds();
    } else if (prevState.zoom !== this.state.zoom) {
      this.updateMarkers();
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

  handleClearTag() {
    this.props.onTagSelect('');
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

    if (info.display === 'location') {
      if (this.props.onTagSelect) {
        this.props.onTagSelect(info.title);
      }

      return;
    }

    if (info.bounds.length > 1) {
      const bounds = new google.maps.LatLngBounds();

      info.bounds.forEach((bound) => {
        bounds.extend({ lat: bound[0], lng: bound[1] });
      });

      this.map.fitBounds(bounds);
      this.map.panTo(bounds.getCenter());
      this.map.panBy(0, -40);

      return;
    }

    if (!(e.ctrlKey || e.metaKey || e.ctrlKey) && info.type === 'photostream') {
      this.props.dispatch(openModal({
        type: 'PHOTOLIBRARY',
        data: { id: info.id, tag: this.props.tag },
        replace: true,
        style: 'minimal',
      }));
      return;
    }

    browserHistory.push(info.url);
  }

  handleZoomChanged() {
    const zoom = this.map.getZoom();

    if (zoom > 20) {
      this.map.setZoom(20);
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

    this.updateMarkers();
    this.updateBounds();
  }

  checkContainerSize() {
    if (!this.ref_container || !this.ref_map || !this.map) {
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
      center: { lat: this.props.defaultLat, lng: this.props.defaultLng },
      zoom: this.state.zoom,
      zoomControl: true,
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
    this.map.addListener('zoom_changed', this.handleZoomChanged);
    this.map.addListener('resize', this.handleResize);

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
    let found = false;
    let changed = false;
    let error = false;

    Object.keys(list).forEach((key) => {
      if (this.markers[key]) {
        this.markers[key].valid = true;
        return;
      }

      this.addMarker(key, list[key]);
      changed = true;
    });


    Object.keys(this.markers).forEach((key) => {
      if (this.markers[key].valid) {
        found = true;
        return;
      }

      this.removeMarker(key);
      changed = true;
    });

    if (changed) {
      // this.updateBounds();
    }

    if (!found) {
      error = Lang('photos-map.not_found', this.props.lang);
    }

    if (error !== this.state.error) {
      this.setState({ error });
    }
  }

  updateBounds() {
    if (!this.map) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    let found = false;

    Object.keys(this.markers).forEach((key) => {
      const info = this.markers[key].info;
      found = true;

      bounds.extend({
        lat: info.lat,
        lng: info.lng,
      });
    });

    if (found) {
      this.map.fitBounds(bounds);
      this.map.panTo(bounds.getCenter());
      this.map.panBy(0, -40);
    } else {
      const latlng = new google.maps.LatLng(this.props.defaultLat, this.props.defaultLng);
      this.map.panTo(latlng);
    }
  }

  makeMarkersList(mode) {
    const zoom = this.state.zoom;

    const breaks = {
      4: [6, 10],
      5: [3, 5],
      6: [1.6, 2.8],
      7: [0.8, 1.4],
      8: [0.4, 0.8],
      9: [0.17, 0.3],
      10: [0.08, 0.15],
      11: [0.05, 0.08],
      12: [0.022, 0.04],
      13: [0.011, 0.02],
      14: [0.005, 0.01],
      15: [0.003, 0.005],
      16: [0.0014, 0.003],
      17: [0.0007, 0.0015],
      18: [0.0007, 0.0015],
      19: [0.0003, 0.0008],
    };

    if (!mode) {
      mode = (zoom >= 8 || this.props.tag) ? 'single' : 'location';
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
      const lat = parseFloat(latlng[0]) || 0;
      const lng = parseFloat(latlng[1]) || 0;
      let key = false;

      if (mode === 'location') {
        key = `l_${marker.loc}`;
      } else {
        key = `g_${marker.id}`;

        if (breaks[zoom]) {
          const lat_c = 1 / (breaks[zoom][0] * 1);
          const lng_c = 1 / (breaks[zoom][1] * 1);

          const g_lat = Math.round((Math.floor(lat * lat_c) / lat_c) * 100000) / 100000;
          const g_lng = Math.round((Math.floor(lng * lng_c) / lng_c) * 100000) / 100000;

          key = `g_${g_lat}_${g_lng}`;
        }
      }

      if (!ret[key]) {
        ret[key] = {
          url: marker.url,
          title: mode === 'location' ? marker.loc : false,
          display: mode,
          type: marker.type,
          id: marker.id,
          bounds: [
            [lat, lng],
          ],
          pics: [
            marker.pic,
          ],
        };

        return;
      }

      ret[key].pics.push(marker.pic);
      ret[key].bounds.push([lat, lng]);
    });

    if (!found && mode === 'single') {
      return this.makeMarkersList('group');
    }

    Object.keys(ret).forEach((key) => {
      const marker = ret[key];

      marker.lat = 0;
      marker.lng = 0;

      marker.bounds.forEach((bounds) => {
        marker.lat += bounds[0];
        marker.lng += bounds[1];
      });

      if (marker.bounds.length > 1) {
        marker.lat /= marker.bounds.length;
        marker.lng /= marker.bounds.length;
      }
    });

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
    if (!this.props.loading && !this.state.error) {
      return null;
    }

    return <div className="photos-map__shadow" />;
  }

  makeTagClear() {
    if (!this.props.tag) {
      return null;
    }

    return (
      <div className="photos-map__clear-tag" onClick={this.handleClearTag}>
        {Lang('photos-map.clear_tag', this.props.lang)}
      </div>
    );
  }

  makeLoader() {
    if (!this.props.loading) {
      return null;
    }

    return <div className="photos-map__loader"><Loader /></div>;
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return <div className="photos-map__error">{this.state.error}</div>;
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
        {this.makeExpand()}
        {this.makeShadow()}
        {this.makeLoader()}
        {this.makeError()}
        {this.makeTagClear()}
      </div>
    );
  }
}

PhotosMap.propTypes = propTypes;
PhotosMap.defaultProps = defaultProps;

export default connect(() => {
  return {

  };
})(PhotosMap);

