/**
 * @file Provides lang support
 * @name Lang
 * @author ferg <me@ferg.in>
 * @copyright 2016 ferg
 */

/* eslint-disable no-use-before-define */

// current lang
let currentLang = 'en';

// locale strings
const langStrings = {};

/**
 *  Find associated to a stringId string, replace variables and return it
 *
 *  @param {string} stringId String id ($prefix.$id)
 *  @param {object} replaces List of replaces (name: value)
 *  @param {string} locale Locale (default = currentLang)
 *  @return {string} Processed string associated to stringId
 */
function Lang(stringId, replaces, locale) {
  if (typeof stringId !== 'string') {
    return stringId;
  }

  if (!locale && typeof replaces === 'string') {
    locale = replaces;
    replaces = {};
  }

  if (typeof replaces !== 'object') {
    replaces = {};
  }

  locale = locale || currentLang;

  const pos = stringId.indexOf('.');
  let prefix = locale;

  if (pos > 0) {
    prefix += '-' + stringId.substring(0, pos);
    stringId = stringId.substring(pos + 1);
  }

  if (typeof langStrings[prefix] !== 'object') return stringId;
  if (typeof langStrings[prefix][stringId] !== 'string') return stringId;

  const string = langStrings[prefix][stringId];

  if (!Object.keys(replaces).length) {
    return string;
  }

  return _processString(string, replaces);
}


/**
 *  Update lang strings
 *
 *  @param {strings} prefix prefix
 *  @param {object} strings Strings list
 *  @param {string} lang Lang (default = currentLang)
 *  @return {boolean} Result of operation
 */
Lang.updateLang = function (prefix, strings, lang) {
  if (typeof prefix !== 'string') return false;
  if (typeof strings !== 'object') return false;

  let key = lang || currentLang;

  if (prefix.length) key += '-' + prefix;

  if (langStrings[key] === undefined) {
    langStrings[key] = strings;
    return true;
  }

  Object.keys(strings).forEach((string_key) => {
    langStrings[key][string_key] = strings[string_key];
  });

  return true;
};

/**
 *  Change current locale
 *
 *  @param {string} New locale
 */
Lang.setLang = function (newLang) {
  if (typeof newLang !== 'string') return;
  if (!newLang.match(/^[a-zA-Z0-9_-]{1,8}$/g)) return;

  currentLang = newLang;
};

/**
 *  Return current locale
 *
 *  @return {string} Current locale
 */
Lang.getLang = function () {
  return currentLang;
};

function _processString(string, replacements = {}) {
  if (typeof replacements !== 'object') {
    replacements = {};
  }

  Object.keys(replacements).forEach((key) => {
    const regexp = new RegExp(_escapeRegexp(`%${key}%`), 'g');
    string = string.replace(regexp, _escapeHTML(replacements[key]));
  });

  if (string.indexOf('rupluralize') >= 0) {
    string = _processRupluralize(string);
  }

  if (string.indexOf('pluralize') >= 0) {
    string = _processPluralize(string);
  }

  return string;
}

function _processRupluralize(string) {
  const regexp = /rupluralize\((\d+(?:\.\d+)?)\s+['"]([^'"]+)['"]\s+['"]([^'"]+)['"]\s+['"]([^'"]+)['"]\)/g;
  let match = regexp.exec(string);
  
  while (match !== null) {
    string = string.replace(
      new RegExp(_escapeRegexp(match[0]), 'g'),
      _rupluralize(match[1], match[2], match[3], match[4])
    );

    regexp.lastIndex = 0;
    match = regexp.exec(string);
  }

  return string;
}

function _rupluralize(amount, first, second, third) {
  amount = parseInt(amount, 10) || 0;
  amount %= 100;

  if (amount >= 10 && amount <= 20) return third;

  amount %= 10;

  if (amount === 1) return first;
  if (amount > 1 && amount < 5) return second;

  return third;
}

function _processPluralize(string) {
  const regexp = /pluralize\((\d+(?:\.\d+)?)\s+['"]([^'"]+)['"]\s+['"]([^'"]+)['"]\)/g;
  let match = regexp.exec(string);
  
  while (match !== null) {
    string = string.replace(
      new RegExp(_escapeRegexp(match[0]), 'g'),
      _pluralize(match[1], match[2], match[3])
    );

    regexp.lastIndex = 0;
    match = regexp.exec(string);
  }

  return string;
}

function _pluralize(amount, one, many) {
  amount = parseInt(amount, 10) || 0;
  return amount === 1 ? one : many;
}

function _escapeRegexp(string) {
  /* eslint-disable no-useless-escape */
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  /* eslint-enable no-useless-escape */
}

function _escapeHTML(string) {
  string += '';

  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default Lang;
