'use strict';

import fetch from 'node-fetch';

/* global API_HOST */

const Request = {
  /**
   *  Fetch request
   *
   *  @param {url} request url
   *  @param {object} request List of request options
   *                     success - success callback
   *                     error - error callback
   *                     data - string, object (key: value) or FormData object
   *                     timeout - request timeout
   */
  fetch(url, options) {
    options = Request._validateOptions(options);
    url = Request._makeUrl(url);

    const headers = Request._makeHeaders(options);
    const body = Request._makeBody(options.data);
    const method = options.method.toUpperCase();

    fetch(url, { method, body, headers })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      if (!json.status || json.status !== 'success') {
        return Promise.reject('internal_server_error');
      }

      if (typeof options.success === 'function') {
        options.success(json.response);
      }

      return json.response;
    })
    .catch((error) => {
      if (typeof options.error === 'function') {
        options.error(error);
      }
    });

    return false;
  },

  /**
   *  Placeholder
   */
  promise() {
    throw new Error('not supported');
  },

  /**
   *  Placeholder
   */
  abort() {
    return false;
  },

  /**
   *  Placeholder
   */
  getProgress() {
    const progress = {
      loaded: 0,
      loaded_total: 0,
      uploaded: 0,
      uploaded_total: 0,
    };

    return progress;
  },

  /**
   *  Placeholder
   */
  getTotalProgress() {
    const progress = {
      requests_total: 0,
      requests_loading: 0,
      loaded: 0,
      loaded_total: 0,
      uploaded: 0,
      uploaded_total: 0,
    };

    return progress;
  },

  /**
   *  Make fetch headers
   *
   *  @param {data} options Request options
   *  @return {object} Fetch headers
   */
  _makeHeaders(options) {
    const csrf_token = Request._getCSRFToken();
    const cookie = ['__csrf_token=' + csrf_token];

    if (options.session) {
      cookie.push('__session_id=' + options.session);
    }

    return {
      Cookie: cookie.join('; '),
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Csrf-Token': csrf_token,
      'X-Forwarded-For': options.remote_ip,
    };
  },

  /**
   *  Process fetch url (add API HOST, if needed)
   *
   *  @param {string} url original url
   *  @return {string} Processed url
   */
  _makeUrl(url) {
    if (url.charAt(0) !== '/') return url;

    return API_HOST + url;
  },

  /**
   *  Make fetch body
   *
   *  @param {object} data request data
   *  @return {string} Fetch data
   */
  _makeBody(data) {
    if (typeof data !== 'object') return data;
    if (typeof data.append === 'function') return data;

    let str = '';
    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; ++i) {
      const name = encodeURIComponent(keys[i]);
      const value = encodeURIComponent(data[keys[i]]);

      str += `&${name}=${value}`;
    }

    return str;
  },

  /**
   *  Make CSRF Token
   *
   *  @return {string} CSRF Token
   */
  _csrf: false,
  _getCSRFToken() {
    if (Request._csrf) return Request._csrf;

    const set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const token = [];

    for (let i = 0; i < 32; ++i) {
      token.push(set.charAt(Math.floor(Math.random() * set.length)));
    }

    Request._csrf = token.join('');

    return Request._csrf;
  },

  /**
   *  Validate options
   *
   *  @param {object} raw options
   *  @return {object} validated options
   */
  _validateOptions(options) {
    if (typeof options !== 'object') {
      options = {};
    }

    if (typeof options.success !== 'function') {
      options.success = false;
    }

    if (typeof options.error !== 'function') {
      options.error = false;
    }

    if (options.data === undefined) {
      options.data = {};
    }

    if (options.remote_ip === undefined) {
      options.remote_ip = '0.0.0.0';
    }

    if (options.session === undefined) {
      options.session = '';
    }

    if (options.timeout === undefined) {
      options.timeout = 60;
    }

    if (options.method === undefined) {
      options.method = 'GET';
    }

    return options;
  },
};

export default Request;
