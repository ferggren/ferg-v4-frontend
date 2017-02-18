'use strict';

const initialState = '';

export default function (state = initialState, action) {
  switch (action.type) {
    case 'LOCATION_SET': {
      return action.location;
    }

    default: {
      return state;
    }
  }
}
