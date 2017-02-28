'use strict';

export function userLogin(info) {
  return {
    type: 'USER_LOGIN',
    info,
  };
}
