'use strict';

/**
 * @file Provides popups
 * @name Popups
 * @author ferg <me@ferg.in>
 * @copyright 2017 ferg
 */

const Popups = {
  _scroll_top: -1,
  _popups: {},
  _animation_timeout: 100,

  _shadow_appearing: { background: 'rgba(40, 40, 40, .01)' },
  _shadow_appeared: { background: 'rgba(40, 40, 40, .5)' },

  _popup_appearing: { opacity: '0.01', transform: 'translateY(20px)' },
  _popup_appeared: { opacity: '1', transform: 'translateY(0px)' },

  /**
   *  Create and return new popup
   */
  createPopup(onclose) {
    if (!Object.keys(Popups._popups).length) {
      Popups._createShadow();
    }

    const popup_id = Popups._makeNextPopupId();
    const popup_node = Popups._makePopupNode();
    const popup_container = Popups._makePopupContainer();

    document.body.appendChild(popup_container);
    popup_container.appendChild(popup_node);

    Popups._popups[popup_id] = {
      id: popup_id,
      node: popup_node,
      container: popup_container,
      close: onclose,
      top: false,
    };

    Popups._updatePopupsZ();
    Popups._initWatch();

    return Popups._popups[popup_id];
  },

  /**
   *  Nice popup remove
   */
  niceRemovePopup(popup_id, callback) {
    const popup = Popups._popups[popup_id];
    const shadow = document.getElementById('__popup_shadow');

    if (!popup) return;

    Popups._appendStyles(popup.node, Popups._popup_appearing);

    if (shadow && Object.keys(Popups._popups).length === 1) {
      Popups._appendStyles(shadow, Popups._shadow_appearing);
    }

    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }

      Popups.removePopup(popup_id);
    }, Popups._animation_timeout);
  },

  /**
   *  Destroy popup
   */
  removePopup(popup_id) {
    let popup = Popups._popups[popup_id];

    if (!popup) return;

    popup.node.parentNode.removeChild(popup.node);
    popup.node = null;

    popup.container.parentNode.removeChild(popup.container);
    popup.container = null;

    Popups._popups[popup_id] = null;

    delete Popups._popups[popup_id];

    if (!Object.keys(Popups._popups).length) {
      Popups._closeShadow();
    }

    popup = null;

    Popups._updatePopupsZ();
  },

    /**
   *  Make next popup ID
   */
  _makeNextPopupId() {
    const keys = Object.keys(Popups._popups);
    let max_id = 0;

    for (let i = 0; i < keys; ++i) {
      max_id = Math.max(max_id, keys[i]);
    }

    return ++max_id;
  },

  /**
   *  Make popup container
   */
  _makePopupContainer() {
    const wrapper = document.createElement('div');

    wrapper.className = 'popup__wrapper';
    wrapper.onclick = Popups._closeTopPopup;
    wrapper.setAttribute('isPopupContainer', true);

    return wrapper;
  },

  /**
   *  Make popup node
   */
  _makePopupNode() {
    let popup = document.createElement('div');
    popup.className = 'popup';

    const transitions = [];
    const keys = Object.keys(Popups._popup_appearing);

    for (let i = 0; i < keys.length; ++i) {
      transitions.push(`${keys[i]} ${Popups._animation_timeout}ms ease`);
    }

    popup.style.transition = transitions.join(', ');

    Popups._appendStyles(popup, Popups._popup_appearing);

    setTimeout(() => {
      Popups._appendStyles(popup, Popups._popup_appeared);
      popup = null;
    }, 1);

    return popup;
  },

  /**
   *  Make shadow
   */
  _createShadow() {
    let shadow = document.getElementById('__popup_shadow');

    if (shadow) return;

    shadow = document.createElement('div');
    shadow.className = 'popup__shadow';

    Popups._appendStyles(shadow, Popups._shadow_appearing);

    const transitions = [];
    const keys = Object.keys(Popups._shadow_appeared);

    for (let i = 0; i < keys.length; ++i) {
      transitions.push(keys[i] + ' ' + Popups._animation_timeout + 'ms ease');
    }

    shadow.style.transition = transitions.join(', ');
    shadow.id = '__popup_shadow';

    shadow.onclick = Popups._closeTopPopup;

    setTimeout(() => {
      Popups._appendStyles(shadow, Popups._shadow_appeared);
    }, 1);

    document.body.appendChild(shadow);
    Popups._scroll_top = document.body.scrollTop || -1;
    document.body.className = 'modal-open';
  },

  /**
   *  Close shadow
   */
  _closeShadow() {
    const shadow = document.getElementById('__popup_shadow');

    if (!shadow) return;

    shadow.parentNode.removeChild(shadow);
    document.body.className = '';

    if (Popups._scroll_top !== -1) {
      window.scrollTo(0, Popups._scroll_top);
      Popups._scroll_top = -1;
    }
  },

  /**
   *  Close popup at the top
   */
  _closeTopPopup(e) {
    if (e &&
        e.target &&
        e.target.getAttribute &&
        !e.target.getAttribute('isPopupContainer')) {
      return;
    }

    const keys = Object.keys(Popups._popups);
    let max_id = 0;

    for (let i = 0; i < keys.length; ++i) {
      max_id = Math.max(keys[i], max_id);
    }

    if (!max_id) return;
    if (typeof Popups._popups[max_id].close !== 'function') return;

    Popups._popups[max_id].close();
  },

  /**
   *  Update popups Z-index
   */
  _updatePopupsZ() {
    const keys = Object.keys(Popups._popups);

    if (!keys.length) return;

    let max_id = 0;

    for (let i = 0; i < keys.length; ++i) {
      const popup_id = keys[i];

      Popups._popups[popup_id].container.style.zIndex = ((2100000000 + parseInt(popup_id, 10)) + '');
      max_id = Math.max(popup_id, max_id);
    }
    
    Popups._popups[max_id].container.style.zIndex = '2100000200';
  },

  _appendStyles(node, styles) {
    const keys = Object.keys(styles);

    for (let i = 0; i < keys.length; ++i) {
      node.style[keys[i]] = styles[keys[i]];
    }
  },

  _watch_init: false,

  _initWatch() {
    if (Popups._watch_init) return;

    Popups._init = true;

    if (!window || !window.addEventListener) return;

    document.addEventListener(
      'keyup', (e) => {
        if (e.keyCode === 27) Popups._closeTopPopup();
        return true;
      },
      false
    );
  },
};

export default Popups;
