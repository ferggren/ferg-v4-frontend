'use strict';

export function userLogin(info) {
  return { type: 'USER_LOGIN', info };
}

export function userLogout() {
  return { type: 'USER_LOGOUT' };
}
