import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';


export default function () {
  const root_reducer = combineReducers({

  });

  /* global NODE_ENV */
  /* global window */
  let state = {};
  if (NODE_ENV === 'dev' && window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    state = window.__REDUX_DEVTOOLS_EXTENSION__();
  }

  return createStore(root_reducer, state, applyMiddleware(thunk));
}
