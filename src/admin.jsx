'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'reducers/admin';
import { setLocation } from 'actions/location';
import routes from 'routes/admin';
import onload from 'libs/onload';

onload(() => {
  const store = configureStore();

  /**
   *  Watch location changes
   */
  browserHistory.listen((location) => {
    const state = store.getState();

    location = location.pathname + location.search;
    location = location.replace(/[?]$/, '');

    if (!location.match(/^\/(en|ru)/)) {
      location = location.replace(/^\/(en|ru)/, '');
      location = '/' + state.lang + location;
    }

    if (state.location === location) return;
    
    store.dispatch(setLocation(location));
  });

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes(store)}
      </Router>
    </Provider>,
    document.getElementById('react-root')
  );
});
