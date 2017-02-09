'use strict';

const initialState = false;

export default function (state = initialState, action) {
  switch (action.type) {
    case 'USER_IP_SET': {
      return action.user_ip;
    }

    default: {
      return state;
    }
  }
}
