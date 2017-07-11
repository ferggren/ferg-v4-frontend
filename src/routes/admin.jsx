'use strict';

/* global NODE_MODE */

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { makeFetchParams, fetchRoutesData } from 'libs/fetch-data';
import AdminContainer from 'containers/admin-container';
import AdminStorage from './admin-storage';
import AdminPhotos from './admin-photos';
import AdminPages from './admin-pages';
import AdminPage from './admin-page';

function fetchData(nextState, replace, callback) {
  // we dont need fetchData on server side
  if (NODE_MODE === 'server') {
    callback();
    return;
  }

  const needs = fetchRoutesData(
    window.REDUX_STORE,
    nextState.routes,
    makeFetchParams(
      nextState.location.query,
      nextState.params,
      nextState.location.pathname
    )
  );

  if (!needs.length) {
    callback();
    return;
  }

  Promise.all(needs)
  .then(() => {
    if (window.scrollTo) window.scrollTo(0, 0);
    callback();
  })
  .catch(() => {
    callback();
  });
}

const routes = [
  <IndexRoute component={AdminPhotos} key="index" onEnter={fetchData} />,
  <Route path="storage" component={AdminStorage} key="storage" onEnter={fetchData} />,
  <Route path="photos" component={AdminPhotos} key="photos" onEnter={fetchData} />,
  <Route path="travel/:id" component={AdminPage} key="page-travel" onEnter={fetchData} />,
  <Route path="travel" component={AdminPages} key="pages-travel" onEnter={fetchData} />,
  <Route path="blog/:id" component={AdminPage} key="page-blog" onEnter={fetchData} />,
  <Route path="blog" component={AdminPages} key="pages-blog" onEnter={fetchData} />,
];

export default (
  <Router history={browserHistory}>
    <Route path="/" component={AdminContainer}>
      <Route path="ru/admin/">{routes}</Route>
      <Route path="en/admin/">{routes}</Route>
      <Route path="*" component={AdminPhotos} />
    </Route>
  </Router>
);
