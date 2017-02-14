'use strict';

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import lang from './lang';
import location from './location';

/* global NODE_ENV */

export default function () {
  const root_reducer = combineReducers({
    lang,
    location,
  });

  let state = {};

  if (NODE_ENV === 'dev') {
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
      state = window.__REDUX_DEVTOOLS_EXTENSION__();
    }
  }

  return createStore(root_reducer, state, applyMiddleware(thunk));
}
