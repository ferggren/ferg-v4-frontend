'use strict';

export default function clone(target) {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  if (target instanceof Array) {
    const copy = [];

    for (let i = 0, len = target.length; i < len; i++) {
      copy[i] = typeof target[i] === 'object' ? clone(target[i]) : target[i];
    }

    return copy;
  }

  if (target instanceof Object) {
    const copy = {};
    const keys = Object.keys(target);

    for (let i = 0; i < keys.length; ++i) {
      const attr = keys[i];
      
      if (!target.hasOwnProperty(attr)) {
        continue;
      }

      copy[attr] = typeof target[attr] === 'object' ? clone(target[attr]) : target[attr];
    }

    return copy;
  }

  return false;
}
