'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'reducers/admin';
import routes from 'routes/admin';
import onload from 'libs/onload';

onload(() => {
  const store = configureStore();

  window.REDUX_STORE = store;

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes(store)}
      </Router>
    </Provider>,
    document.getElementById('react-root')
  );
});
