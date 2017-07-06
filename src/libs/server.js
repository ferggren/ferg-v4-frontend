'use strict';

import Request from 'libs/request';
import FS from 'fs';
import md5File from 'md5-file';
import { titleWebsite, titleSeparator } from 'data/title-config';

/**
 *  Check if user browser have support of modern JS
 */
export function areScriptsEnabled(headers) {
  if (!headers['user-agent']) return true;

  const user_agent = headers['user-agent'];

  if (user_agent.match(/MSIE\s*\d+/i)) return false;
  if (user_agent.match(/Trident\/\s*\d+/i)) return false;
  if (user_agent.match(/Opera Mini\/\s*\d+/i)) return false;
  if (user_agent.match(/UCWEB\/\s*\d+/i)) return false;

  return true;
}

/**
 *  Get user ip
 */
export function getUserIp(headers) {
  if (!headers['x-real-ip']) return false;

  const user_ip = headers['x-real-ip'];
  const match = user_ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

  return match ? user_ip : false;
}

/**
 *  Get user session
 */
export function getUserSession(headers) {
  if (!headers.cookie) return false;

  const cookie = headers.cookie;
  const session = cookie.match(/__session_id=([^;:\s\n\r\t]+)/);

  return session ? session[1] : false;
}

/**
 *  Load user data
 */
export function loadUserData(user_session, user_ip) {
  const promise = [];

  if (!user_session) return promise;

  promise.push(
    new Promise((resolve) => {
      Request.fetch(
        '/api/user/getInfo', {
          success: (user_info) => {
            resolve(user_info);
          },

          error: (error) => {
            resolve(error);
          },

          method: 'GET',
          remote_ip: user_ip,
          session: user_session,
        }
      );
    })
  );

  return promise;
}

/**
 *  Get user lang locale
 */
export function getUserLang(req) {
  const valid = ['ru', 'en'];

  if (req.query && req.query.USER_LANG) {
    if (valid.indexOf(req.query.USER_LANG) >= 0) {
      return req.query.USER_LANG;
    }
  }

  if (req.headers && req.headers['accept-language']) {
    let accept = req.headers['accept-language'];
    accept = accept.replace(/;/g, ',');
    accept = accept.toLowerCase().split(',');

    for (let i = 0; i < accept.length; ++i) {
      const lang = accept[i];

      if (valid.indexOf(lang) >= 0) {
        return lang;
      }
    }
  }

  return valid[0];
}

/**
 *  Get user location
 */
export function getLocation(req) {
  let location = req.url;

  location = location.replace(/&?USER_LANG=(en|ru)/, '');
  location = location.replace(/[?]$/, '');
  location = location.replace(/^\/(en|ru)/, '');
  location = '/' + getUserLang(req) + location;

  return location;
}

/**
 *  Make file hash
 */
const _file_hashes = {};
export function makeFileHash(file) {
  const time = Math.round(new Date().getTime() / 1000);

  if (_file_hashes[file] !== undefined) {
    if ((time - _file_hashes[file].time) <= 30) {
      return _file_hashes[file].hash;
    }
  }

  if (!FS.existsSync(file)) {
    _file_hashes[file] = { time, hash: false };
    return false;
  }

  const hash = md5File.sync(file);

  _file_hashes[file] = {
    time,
    hash: hash || false,
  };

  return _file_hashes[file].hash;
}

/**
 *  Make path to script
 */
export function makePathToAsset(script) {
  /* global NODE_ENV */
  if (NODE_ENV === 'dev') {
    return `/assets/${script}?v=${Math.random()}`;
  }

  let hash = makeFileHash(`./public/assets/${script}`);
  hash = hash ? `v_${hash.substring(0, 8)}/` : '';

  return `/assets/${hash}${script}`;
}

/**
 *  Render admin HTML
 */
export function renderAdminHTML(state) {
  let styles = '';

  if (NODE_ENV !== 'dev') {
    styles = `<link href="${makePathToAsset('admin.css')}" rel="stylesheet" />`;
  }

  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="${state.lang}">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="alternate" hreflang="x-default" href="//ferg.in/admin/" />
        <link rel="alternate" hreflang="ru-ru" href="//ferg.in/admin/ru/" />
        <link rel="alternate" hreflang="en-us" href="//ferg.in/admin/en/" />
        <title>Admin CP ${titleSeparator} ${titleWebsite}</title>
        ${styles}
        <script src="${makePathToAsset('admin.js')}" async></script>
      </head>
      <body style="padding: 0px; margin: 0px;">
        <div id="react-root">
          <div style="line-height: 100vh; text-align: center;">Loading...</div>
        </div>
        <script>window.REDUX_INITIAL_STATE=${JSON.stringify(state)};</script>
      </body>
    </html>
  `.trim().replace(/^ {4}/gm, '');

  return html;
}

export function renderClientHTML(clientHTML, state, scriptsEnabled, counters) {
  let scripts_bundle = '';
  let scripts_redux = '';
  let styles = '';
  let analytics = '';

  if (NODE_ENV !== 'dev') {
    styles = `<link href="${makePathToAsset('ferg.css')}" rel="stylesheet" />`;
  }

  if (counters) {
    const keys = Object.keys(counters);

    for (let i = 0; i < keys.length; ++i) {
      analytics += counters[i];
    }
  }

  if (scriptsEnabled) {
    scripts_redux = `<script>window.REDUX_INITIAL_STATE=${JSON.stringify(state)};</script>`;
    scripts_bundle = `<script src="${makePathToAsset('ferg.js')}" async></script>`;
  }

  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="${state.lang}">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="alternate" hreflang="x-default" href="//ferg.in/" />
        <link rel="alternate" hreflang="ru-ru" href="//ferg.in/ru/" />
        <link rel="alternate" hreflang="en-us" href="//ferg.in/en/" />
        <title>${state.title} ${titleSeparator} ${titleWebsite}</title>
        ${styles}
        ${scripts_bundle}
      </head>
      <body style="padding: 0px; margin: 0px;">
        <div id="react-root">${clientHTML}</div>
        ${scripts_redux}
        <div class="app-counters">
          ${analytics}
        </div>
      </body>
    </html>
  `.trim().replace(/^ {4}/gm, '');

  return html;
}
