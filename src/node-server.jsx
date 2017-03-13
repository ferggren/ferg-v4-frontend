'use strict';

import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import { match, RouterContext } from 'react-router';
import fergRoutes from 'routes/ferg';
import { Provider } from 'react-redux';
import {
  areScriptsEnabled,
  getUserIp,
  getUserSession,
  loadUserData,
  renderAdminHTML,
  renderClientHTML,
  getUserLang,
  getLocation,
} from 'libs/server';
import { makeFetchParams, fetchComponentsData } from 'libs/fetch-data';
import Lang from 'libs/lang';
import configureStore from 'reducers';
import { setUserIp } from 'actions/user_ip';
import { setLang } from 'actions/lang';
import { setLocation } from 'actions/location';
import { setSession } from 'actions/session';
import { userLogin } from 'actions/user';

/* global NODE_ENV */
/* global NODE_PORT */
/* eslint-disable no-console */

const server = express();
server.disable('x-powered-by');

// process request
server.use((req, res) => {
  const store = configureStore();
  const scripts_enabled = areScriptsEnabled(req.headers);
  const user_ip = getUserIp(req.headers);
  const user_session = getUserSession(req.headers);
  const user_lang = getUserLang(req);
  const location = getLocation(req);

  store.dispatch(setUserIp(user_ip));
  store.dispatch(setSession(user_session));
  store.dispatch(setLang(user_lang));
  store.dispatch(setLocation(location));

  if (NODE_ENV === 'dev') {
    console.log(`[${user_ip}, ${user_lang}, ${scripts_enabled}] new request: ${req.url}`);
  }

  // check if user is logged in (thru API)
  Promise.all(loadUserData(user_session, user_ip))
  .then((user_info) => {
    let is_admin = false;
    user_info = typeof user_info === 'object' ? user_info[0] : false;

    if (user_info && user_info.id) {
      store.dispatch(userLogin(user_info));
      is_admin = user_info.groups.indexOf('admin') !== -1;
    }

    // admin CP
    if (is_admin && req.url.match(/^\/((?:en|ru)\/)?admin/)) {
      const content = renderAdminHTML(store.getState());

      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
        ETag: '',
      });

      res.status(200).end(content);
      return;
    }

    // server side rendering
    match({ routes: fergRoutes, location: req.url }, (error, redirect, renderProps) => {
      if (redirect) {
        res.redirect(301, `${redirect.pathname}${redirect.search}`);
        return;
      }

      if (error) {
        res.status(500).end('Internal server error');
        return;
      }

      if (!renderProps) {
        res.status(404).end('Not found');
        return;
      }

      fetchComponentsData(
        store,
        renderProps.components,
        makeFetchParams(req.query, renderProps.params, req.url)
      )
      .then(() => {
        Lang.setLang(user_lang);

        // make component
        const clientHTML = ReactDOM.renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        // make HTML response
        const content = renderClientHTML(
          clientHTML,
          store.getState(),
          scripts_enabled
        );

        res.set({
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(content, 'utf8'),
          ETag: '',
        });

        res.status(200).end(content);
      })
      .catch((err) => {
        if (NODE_ENV === 'dev') console.log(`request error: ${err}`);
        res.status(500).end('Internal server error');
      });
    });
  })
  .catch((err) => {
    if (NODE_ENV === 'dev') console.log(`request error: ${err}`);
    res.status(500).end('Internal server error');
  });
});

server.listen(NODE_PORT, () => {
  if (NODE_ENV === 'dev') {
    console.log(`Server listening on: ${NODE_PORT}`);
  }
});
