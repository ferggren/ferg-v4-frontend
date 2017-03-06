'use strict';

/* global NODE_MODE */

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { AdminContainer } from 'containers/admin';
import AdminStorage from './admin-storage';
import AdminGallery from './admin-gallery';
import Admin365 from './admin-365';

function fetchData(nextState, replace, callback) {
  // we dont need fetchData on server side
  if (NODE_MODE === 'server') {
    callback();
    return;
  }

  callback();
}

const routes = [
  <IndexRoute component={AdminStorage} key="index" onEnter={fetchData} />,
  <Route path="storage" component={AdminStorage} key="blog" onEnter={fetchData} />,
  <Route path="gallery" component={AdminGallery} key="blog" onEnter={fetchData} />,
  <Route path="365" component={Admin365} key="365" onEnter={fetchData} />,
];

export default (
  <Router history={browserHistory}>
    <Route path="/" component={AdminContainer}>
      <Route path="ru/admin/">{routes}</Route>
      <Route path="en/admin/">{routes}</Route>
      <Route path="*" component={AdminStorage} />
    </Route>
  </Router>
);
