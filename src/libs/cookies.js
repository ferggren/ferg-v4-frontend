'use strict';

/**
 * @file Provides cookies support
 * @name Cookies
 * @author ferg <me@ferg.in>
 * @copyright 2016 ferg
 */

function escape(value) {
  return value.replace(/[;\s\n\r=,$"\\]/g, '');
}

/**
 *  Set cookie
 *
 *  @param {string} name Cookie name
 *  @param {string} value Cookie value
 *  @param {number} expires Cookie expiration time
 */
export function setCookie(name, value, expires) {
  expires = parseInt(expires, 10);

  if (isNaN(expires)) {
    expires = '';
  } else {        
    const date = new Date();
    date.setTime(date.getTime() + (expires * 1000));
    expires = '; expires=' + date.toGMTString();
  }

  name = escape(name);
  value = escape(value);

  if (name.length < 1) return;

  document.cookie = `${name}=${value}${expires}; path=/`;
}

/**
 *  Remove cookie
 *
 *  @param {string} name Cookie name
 */
export function removeCookie(name) {
  setCookie(name, '', -86400 * 365);
}

/**
 *  Get cookie value
 *
 *  @param {string} name Cookie name
 *  @return {string} Cookie value
 */
export function getCookie(name) {
  const cookies = document.cookie.split(';');
  name = escape(name) + '=';

  for (let i = 0; i < cookies.length; ++i) {
    const cookie = cookies[i].trim();

    if (cookie.indexOf(name) !== 0) continue;

    return cookie.substring(name.length);
  }

  return '';
}
