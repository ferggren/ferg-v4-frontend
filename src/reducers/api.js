'use strict';

import Request from 'libs/request';
import deepClone from 'libs/deep-clone';

const initialState = {};

function abortRequest(data) {
  if (!data.request) return;

  Request.abort(data.request);
  data.request = false;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'API_DATA_CLEAR': {
      if (!state[action.key]) return state;

      state = deepClone(state);

      abortRequest(state[action.key]);
      
      state[action.key] = null;
      delete state[action.key];

      return state;
    }

    case 'API_DATA_INIT': {
      state = deepClone(state);

      if (!state[action.key]) {
        state[action.key] = {
          results: {},
          request: false,
        };
      }

      state[action.key].loading = false;
      state[action.key].loaded = false;
      state[action.key].error = false;
      state[action.key].lang = action.options.USER_LANG || false;
      state[action.key].options = {};

      Object.keys(action.options).forEach((key) => {
        state[action.key].options[key] = action.options[key];
      });

      return state;
    }

    case 'API_REQUEST_ABORT': {
      if (!state[action.key]) return state;
      if (!state[action.key].request) return state;

      state = deepClone(state);

      abortRequest(state[action.key]);

      return state;
    }

    case 'API_REQUEST_SET': {
      if (!state[action.key]) return state;
      if (state[action.key].loaded) return state;

      state = deepClone(state);

      abortRequest(state[action.key]);
      state[action.key].request = action.request;

      return state;
    }

    case 'API_LOAD_STARTED': {
      if (!state[action.key]) return state;

      state = deepClone(state);

      state[action.key].loading = true;
      state[action.key].loaded = false;
      state[action.key].error = false;

      return state;
    }

    case 'API_LOAD_ERROR': {
      if (!state[action.key]) return state;

      state = deepClone(state);

      state[action.key].request = false;
      state[action.key].loading = false;
      state[action.key].loaded = true;
      state[action.key].results = {};
      state[action.key].error = action.error;

      return state;
    }

    case 'API_LOAD_SUCCESS': {
      if (!state[action.key]) return state;
      
      state = deepClone(state);

      state[action.key].request = false;
      state[action.key].loading = false;
      state[action.key].loaded = true;
      state[action.key].results = action.response;
      state[action.key].error = false;

      return state;
    }

    default: {
      return state;
    }
  }
}
