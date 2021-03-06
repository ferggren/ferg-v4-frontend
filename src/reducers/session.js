'use strict';

const initialState = false;

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SESSION_SET': {
      return action.session;
    }

    case 'SESSION_CLEAR': {
      return '';
    }

    default: {
      return state;
    }
  }
}
