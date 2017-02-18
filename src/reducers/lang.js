'use strict';

const initialState = '';

export default function (state = initialState, action) {
  switch (action.type) {
    case 'LANG_SET': {
      return action.lang;
    }

    default: {
      return state;
    }
  }
}
