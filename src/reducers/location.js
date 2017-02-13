'use strict';

const initialState = false;

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
