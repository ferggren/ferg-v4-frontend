'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { SiteContainer } from 'containers/site';
import { makeFetchParams, fetchRoutesData } from 'libs/fetch-data';
import Site365 from './site-365';
import SiteBlog from './site-blog';
import SiteBlogPage from './site-blog-page';
import SiteGallery from './site-gallery';
import SiteGalleryPhoto from './site-gallery-photo';
import SiteLanding from './site-landing';

/* global NODE_MODE */

function fetchData(nextState, replace, callback) {
  // we dont need fetchData on server side
  if (NODE_MODE === 'server') {
    callback();
    return;
  }

  const needs = fetchRoutesData(
    window.REDUX_STORE,
    nextState.routes,
    makeFetchParams(nextState.location.query, nextState.params)
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
  <IndexRoute component={SiteLanding} key="index" onEnter={fetchData} />,
  <Route path="gallery" component={SiteGallery} key="gallery" onEnter={fetchData} />,
  <Route path="gallery/:photo_id" component={SiteGalleryPhoto} key="gallery_photo" onEnter={fetchData} />,
  <Route path="events" component={SiteBlog} key="events" onEnter={fetchData} />,
  <Route path="events/:page_id" component={SiteBlogPage} key="events_page" onEnter={fetchData} />,
  <Route path="blog" component={SiteBlog} key="blog" onEnter={fetchData} />,
  <Route path="blog/:page_id" component={SiteBlogPage} key="blog_page" onEnter={fetchData} />,
  <Route path="365" component={Site365} key="365" onEnter={fetchData} />,
];

export default (
  <Router history={browserHistory}>
    <Route path="/" component={SiteContainer}>
      {routes}
      <Route path="ru/">{routes}</Route>
      <Route path="en/">{routes}</Route>
      <Route path="*" component={SiteLanding} />
    </Route>
  </Router>
);
