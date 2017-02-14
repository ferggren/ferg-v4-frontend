'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { AdminContainer } from 'containers/admin';
import AdminStorage from './admin-storage';

/* global NODE_MODE */
let siteStore = false;

function fetchData(nextState, replace, callback) {
  // we dont need fetchData on server side
  if (!siteStore || NODE_MODE === 'server') {
    callback();
    return;
  }

  callback();
}

function configureAdminRoutes(store = false) {
  siteStore = store;

  const routes = [
    <IndexRoute component={AdminStorage} key="index" onEnter={fetchData} />,
    <Route path="storage" component={AdminStorage} key="gallery" onEnter={fetchData} />,
  ];

  return (
    <Router history={browserHistory}>
      <Route path="/" component={AdminContainer}>
        {routes}
        <Route path="ru/">{routes}</Route>
        <Route path="en/">{routes}</Route>
        <Route path="*" component={AdminStorage} />
      </Route>
    </Router>
  );
}

export default configureAdminRoutes;
