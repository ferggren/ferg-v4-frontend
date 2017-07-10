'use strict';

import deepClone from 'libs/deep-clone';

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case 'OPEN_MODAL': {
      state = deepClone(state);
      let index = state.length;

      if (action.replace) {
        for (let i = state.length - 1; i >= 0; --i) {
          if (state[i].type !== action.modal_type) {
            continue;
          }

          index = i;
          break;
        }
      }

      state[index] = {
        type: action.modal_type,
        data: action.data,
        style: action.style,
      };

      return state;
    }

    case 'CLOSE_MODAL': {
      state = deepClone(state);

      do {
        let index = -1;

        for (let i = state.length - 1; i >= 0; --i) {
          if (state[i].type !== action.modal_type) {
            continue;
          }

          index = i;
          break;
        }

        if (index === -1) break;

        state.splice(index, 1);
      } while (true);

      return state;
    }

    default: {
      return state;
    }
  }
}
