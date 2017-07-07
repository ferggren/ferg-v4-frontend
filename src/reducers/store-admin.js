'use strict';

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import user_ip from './user_ip';
import session from './session';
import user from './user';
import lang from './lang';
import location from './location';
import title from './title';
import api from './api';
import gallery from './gallery';

/* global NODE_ENV */

export default function (state = {}) {
  const reducer = combineReducers({
    user_ip,
    session,
    lang,
    location,
    user,
    title,
    api,
    gallery,
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

  return createStore(reducer, state, enhancer);
}
