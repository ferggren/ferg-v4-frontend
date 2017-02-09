import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import user_ip from './user_ip';
import session from './session';

export default function () {
  const root_reducer = combineReducers({
    user_ip,
    session,
  });

  const window = window || {};
  let state = {};

  /* global NODE_ENV */  
  if (NODE_ENV === 'dev' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    state = window.__REDUX_DEVTOOLS_EXTENSION__();
  }

  return createStore(root_reducer, state, applyMiddleware(thunk));
}
