'use strict';

export function userLogin(user_info) {
  return {
    type: 'USER_LOGIN',
    user_info,
  };
}
