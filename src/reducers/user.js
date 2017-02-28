'use strict';

const initialState = {
  logged_in: false,
  is_admin: false,
  info: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {
        logged_in: true,
        is_admin: (action.info.groups.indexOf('admin') !== -1),
        info: action.info,
      };
    }

    case 'USER_LOGOUT': {
      return {
        logged_in: false,
        is_admin: false,
        info: {},
      };
    }

    default: {
      return state;
    }
  }
}
