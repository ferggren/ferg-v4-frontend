'use strict';

/* global google */

import React from 'react';
import PropTypes from 'prop-types';
import './styles';

const defaultLocation = { lat: 55.014578, lng: 82.919764 };

const propTypes = {
  onClick: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  onChange: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  showControls: PropTypes.bool,
};

const defaultProps = {
  onClick: false,
  onChange: false,
  location: false,
  showControls: true,
  height: false,
  width: false,
  className: false,
};

class LocationPicker extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.map = false;
    this.searchBox = false;
    this.marker = false;
    this.ref_map = false;
    this.ref_input = false;
    this.watch_google_loaded = false;
    this.watch_container_size = false;
    this.last_container_w = false;
    this.last_container_h = false;

    this.checkContainerSize = this.checkContainerSize.bind(this);
    this.handleMapClicked = this.handleMapClicked.bind(this);
    this.handleMarkerDragged = this.handleMarkerDragged.bind(this);
    this.setRefMap = this.setRefMap.bind(this);
    this.setRefInput = this.setRefInput.bind(this);
    this.initMap = this.initMap.bind(this);
    this.handlePlaceSelected = this.handlePlaceSelected.bind(this);
  }

  componentDidMount() {
    this.initMap();
    this.updateContainerSize();

    window.addEventListener('resize', this.checkContainerSize);
    this.watch_container_size = setInterval(this.checkContainerSize, 1000);
  }

  componentDidUpdate(prevProps) {
    const prevLocation = this.getUserLocation(prevProps.location);
    const nextLocation = this.getUserLocation(this.props.location);

    if (typeof prevLocation !== typeof nextLocation ||
        (nextLocation && prevLocation.lat !== nextLocation.lat && prevLocation.lng !== nextLocation.lng)
        ) {
      this.updateMarker();
    }
  }

  componentWillUnmount() {
    if (this.watch_container_size) {
      clearInterval(this.watch_container_size);
      this.watch_container_size = false;
    }

    window.removeEventListener('resize', this.checkContainerSize);
    this.removeMarker();

    this.ref_map = false;
    this.ref_input = false;
    this.map = null;
    this.searchBox = null;

    if (this.watch_google_loaded) {
      clearTimeout(this.watch_google_loaded);
      this.watch_google_loaded = false;
    }
  }

  setRefMap(c) {
    this.ref_map = c;
  }

  setRefInput(c) {
    this.ref_input = c;
  }

  getUserLocation(location) {
    if (typeof location === 'undefined') {
      location = this.props.location;
    }

    if (Array.isArray(location)) {
      if (location.length !== 2) {
        return false;
      }

      return {
        lat: location[0],
        lng: location[1],
      };
    }

    if (typeof location === 'object') {
      if (!location.lat || !location.lng) {
        return false;
      }

      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    if (typeof location !== 'string') {
      return false;
    }

    const match = location.match(/^(-?\d+\.\d+)\s+(-?\d+\.\d+)$/);

    if (!match) {
      return false;
    }

    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
    };
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

    if (window.google) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  initMap() {
    if (this.map) return;

    if (typeof window.google === 'undefined' || !this.ref_map) {
      this.watch_google_loaded = setTimeout(this.initMap, 100);
      return;
    }

    const location = this.getUserLocation();

    this.map = new google.maps.Map(this.ref_map, {
      clickableIcons: false,
      center: location || defaultLocation,
      zoom: location ? 11 : 7,
      fullscreenControl: this.props.showControls,
      mapTypeControl: this.props.showControls,
      zoomControl: this.props.showControls,
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

    if (this.props.showControls && this.ref_input) {
      this.searchBox = new google.maps.places.SearchBox(this.ref_input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.ref_input);
      this.searchBox.addListener('places_changed', this.handlePlaceSelected);
    }

    this.map.addListener('click', this.handleMapClicked);
    this.updateContainerSize();
    this.updateMarker();
  }

  handleMapClicked(e) {
    if (!e.latLng) {
      return;
    }

    if (!this.props.onChange) {
      return;
    }

    this.props.onChange({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }

  handleMarkerDragged(e) {
    if (!e.latLng) {
      return;
    }

    if (!this.props.onChange) {
      return;
    }

    this.props.onChange({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }

  handlePlaceSelected() {
    if (!this.map || !this.searchBox) {
      return;
    }

    const places = this.searchBox.getPlaces();
    const bounds = new google.maps.LatLngBounds();
    let found = false;

    places.forEach((place) => {
      if (!place.geometry) {
        return;
      }

      found = true;

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    if (found) {
      this.map.fitBounds(bounds);
    }
  }

  updateContainerSize() {
    if (!this.map) return;
    google.maps.event.trigger(this.map, 'resize');
  }

  updateMarker() {
    if (!this.map) {
      return;
    }

    const location = this.getUserLocation();

    if (!location) {
      this.removeMarker();
      return;
    }

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        draggable: !!this.props.onChange,
      });

      google.maps.event.addListener(this.marker, 'dragend', this.handleMarkerDragged);
    } else {
      this.marker.setPosition(location);
      this.map.setCenter(location);
    }
  }

  removeMarker() {
    if (!this.marker) {
      return;
    }

    this.marker.setMap(null);
    this.marker = null;

    if (this.map) {
      google.maps.event.clearListeners(this.map, 'dragend');
    }
  }

  makeInput() {
    if (!this.props.showControls) {
      return null;
    }

    return (
      <input
        type="text"
        className="location-picker__input"
        placeholder="Search for location"
        ref={this.setRefInput}
      />
    );
  }

  makeOverlay() {
    if (!this.props.onClick) {
      return null;
    }

    return <div className="location-picker__overlay" onClick={this.props.onClick} />;
  }

  render() {
    const props = {
      className: 'location-picker',
      style: {},
    };

    if (this.props.className) {
      props.className += ` ${this.props.className}`;
    }

    if (this.props.width) {
      props.style.width = this.props.width;
    }

    if (this.props.height) {
      props.style.height = this.props.height;
    }

    return (
      <div {...props}>
        {this.makeInput()}
        <div ref={this.setRefMap} style={{ width: '100%', height: '100%' }} />
        {this.makeOverlay()}
      </div>
    );
  }
}

LocationPicker.propTypes = propTypes;
LocationPicker.defaultProps = defaultProps;

export default LocationPicker;
