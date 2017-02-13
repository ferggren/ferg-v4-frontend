'use strict';

import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import user_ip from './user_ip';
import session from './session';
import lang from './lang';
import location from './location';

export default function () {
  const root_reducer = combineReducers({
    user_ip,
    session,
    lang,
    location,
  });

  let win = {};
  let state = {};

  if (typeof window !== 'undefined') {
    win = window;
  }

  /* global NODE_ENV */  
  if (NODE_ENV === 'dev' && win.__REDUX_DEVTOOLS_EXTENSION__) {
    state = win.__REDUX_DEVTOOLS_EXTENSION__();
  }

  return createStore(root_reducer, state, applyMiddleware(thunk));
}
