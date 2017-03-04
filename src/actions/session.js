'use strict';

export function setSession(session) {
  return { type: 'SESSION_SET', session };
}
