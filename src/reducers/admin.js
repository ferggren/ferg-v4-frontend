'use strict';

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import lang from './lang';
import user from './user';
import location from './location';

/* global NODE_ENV */

export default function (state = {}) {
  const root_reducer = combineReducers({
    user,
    lang,
    location,
  });

  let composeEnhancers = compose;

  if (NODE_ENV === 'dev') {
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const enhancer = composeEnhancers(
    applyMiddleware(thunk)
  );

  return createStore(root_reducer, state, enhancer);
}
