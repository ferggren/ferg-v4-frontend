'use strict';

const TIMEOUT_MIN = 2000;
const TIMEOUT_MAX = 3000;

/* global google */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

export default function (info, onClick) {
  let container = null;
  let photo = null;
  let bg_timeout = false;

  const latlng = new google.maps.LatLng(info.lat, info.lng);
  const markerLocation = new google.maps.OverlayView();

  function updateBg() {
    bg_timeout = false;

    if (!photo || !container) {
      return;
    }

    const pic = info.pics[getRandomInt(0, info.pics.length - 1)];
    photo.style.backgroundImage = `url('${pic}')`;

    bg_timeout = setTimeout(updateBg, getRandomInt(TIMEOUT_MIN, TIMEOUT_MAX));
  }

  markerLocation.onAdd = function () {
    if (container) {
      return;
    }

    container = document.createElement('a');
    container.className = `photos-map__marker photos-map__marker--${info.display}`;

    if (info.url) {
      container.href = info.url;
    }

    const pill = document.createElement('div');
    pill.className = 'photos-map__marker-pill';
    container.appendChild(pill);

    photo = document.createElement('div');
    photo.className = 'photos-map__marker-image';
    photo.style.backgroundImage = `url('${info.pics[0]}')`;
    container.appendChild(photo);

    if (info.display === 'location') {
      const text = document.createElement('div');
      text.className = 'photos-map__marker-text';
      text.innerHTML = info.title;
      container.appendChild(text);

      const amount = document.createElement('div');
      amount.className = 'photos-map__marker-amount';
      amount.innerHTML = info.pics.length;
      container.appendChild(amount);
    }

    if (info.display === 'single' && info.pics.length > 1) {
      const amount = document.createElement('div');
      amount.className = 'photos-map__marker-amount';
      amount.innerHTML = info.pics.length;
      container.appendChild(amount);
    }

    if (info.pics.length > 1) {
      if (bg_timeout) {
        clearInterval(bg_timeout);
      }

      bg_timeout = setTimeout(updateBg, getRandomInt(TIMEOUT_MIN, TIMEOUT_MAX));
    }

    this.getPanes().overlayMouseTarget.appendChild(container);

    google.maps.event.addDomListener(container, 'click', (e) => {
      onClick(e, info);
    });
  };

  markerLocation.draw = function () {
    const point = this.getProjection().fromLatLngToDivPixel(latlng);
  
    if (point) {
      container.style.left = `${point.x}px`;
      container.style.top = `${point.y}px`;
    }
  };

  markerLocation.onRemove = function () {
    if (!container) {
      return;
    }

    if (bg_timeout) {
      clearTimeout(bg_timeout);
    }

    container.parentNode.removeChild(container);
    container = null;
  };

  return markerLocation;
}
