'use strict';

import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('nice-time', langRu, 'ru');
Lang.updateLang('nice-time', langEn, 'en');

const MONTH_MAP = {
  0: 'january',
  1: 'february',
  2: 'march',
  3: 'april',
  4: 'may',
  5: 'june',
  6: 'july',
  7: 'august',
  8: 'september',
  9: 'october',
  10: 'november',
  11: 'december',
};

function _getTodayTime() {
  let today = 0;

  if (Date.now) {
    today = Date.now();
  } else {
    today = new Date().getTime();
  }

  const offset = -(new Date().getTimezoneOffset() * 60);

  today = Math.round(today / 1000);
  today += offset;
  today -= today % 86400;
  today -= offset;

  return today;
}

/**
 *  Return today's 00:00 unix timestamp
 *
 *  @return {nuber} Unix timestamp
 */
const TODAY = _getTodayTime();

/**
 *  Makes nice date string from unix timetamp
 *
 *  @param {number} time Unix timestamp
 *  @return {string} Nice formatted date
 */
export function niceDateFormat(time) {
  const today = TODAY;

  if (time > today) {
    return Lang('nice-time.today');
  }

  if ((today - time) < 86400) {
    return Lang('nice-time.yesterday');
  }

  const date = new Date(time * 1000);

  let ret = date.getDate();
  ret += ' ';
  ret += Lang(
    'nice-time.date_' + MONTH_MAP[date.getMonth()]
  );

  if ((today - time) > (86400 * 365)) {
    ret += ' ' + date.getFullYear();
  }

  return ret;
}

/**
 *  Makes nice date & time string from unix timetamp
 *
 *  @param {number} time Unix timestamp
 *  @return {string} Nice formatted date & time
 */
export function niceTimeFormat(time) {
  const date = new Date(time * 1000);

  let hours = date.getHours();
  if (hours < 10) hours = '0' + hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;

  return `${niceDateFormat(time)}, ${hours}:${minutes}`;
}

/**
 *  Makes nice month string fron unix timestamp
 *
 *  @param {number} time Unix timestamp
 *  @return {string} Nice formatted month
 */
export function niceMonthFormat(time) {
  const date = new Date(time * 1000);

  const month = Lang(
    'nice-time.month_' + MONTH_MAP[date.getMonth()]
  );
  
  return `${month} ${date.getFullYear()}`;
}
