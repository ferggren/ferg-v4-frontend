'use strict';

export default function objectsCmp(a, b) {
  const type_a = typeof a;
  const type_b = typeof b;

  if (type_a !== type_b) return false;
  if (type_a !== 'object') return a !== b;

  if (a instanceof Array) {
    if (a.length !== b.length) return false;
    
    for (let i = a.length - 1; i > 0; i--) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }

  const keys = Object.keys(a);

  for (let i = keys.length - 1; i > 0; i--) {
    if (a[keys[i]] !== b[keys[i]]) return false;
  }

  return true;
}
