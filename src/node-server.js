'use strict';

import React from 'react';
import ReactDOM from 'react-dom/server';
import express from 'express';
import configureStore from 'reducers/site';
import { match, RouterContext } from 'react-router';
import { setUserIp } from 'actions/user_ip';
import { setSession } from 'actions/session';
import { userLogin } from 'actions/user';
import {
  areScriptsEnabled,
  getUserIp,
  getUserSession,
  loadUserData,
  renderAdminHTML,
} from 'utils/server';

/* global NODE_ENV */
/* global NODE_PORT */
/* eslint no-console: "off" */

const server = express();
server.disable('x-powered-by');

/**
 *  Process requests
 */
server.use((req, res) => {
  const store = configureStore();
  const scripts_enabled = areScriptsEnabled(req.headers);
  const user_ip = getUserIp(req.headers);
  const user_session = getUserSession(req.headers);

  store.dispatch(setUserIp(user_ip));
  store.dispatch(setSession(user_session));

  console.log(`[${user_ip}] new request: ${req.url}`);

  Promise.all(loadUserData(user_session, user_ip))
  .then((user_info) => {
    let is_admin = false;

    if (typeof user_info === 'object' && user_info.length) {
      store.dispatch(userLogin(user_info[0]));
      is_admin = user_info[0].groups.indexOf('admin') !== -1;
    }

    if (req.url.match(/^\/admin/)) {
      if (is_admin) {
        res.status(200).end(renderAdminHTML());
        return;
      }
      
      res.redirect(301, '/');
      return;
    }

    res.status(200).end('it works!');
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
