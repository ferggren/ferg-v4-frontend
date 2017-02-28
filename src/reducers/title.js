'use strict';

const initialState = '';

export default function (state = initialState, action) {
  switch (action.type) {
    case 'TITLE_SET': {
      return action.title;
    }

    default: {
      return state;
    }
  }
}
