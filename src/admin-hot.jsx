'use strict';

/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers/admin';
import onload from 'libs/onload';
import { AppContainer } from 'react-hot-loader';
import { Admin } from 'containers/admin';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});

  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  ReactDOM.render(
    <AppContainer>
      <Admin />
    </AppContainer>,
    document.getElementById('react-root')
  );

  if (module.hot) {
    module.hot.accept('./containers/admin', () => {
      const NewAdmin = require('containers/admin').Admin;

      ReactDOM.render(
        <AppContainer>
          <NewAdmin />
        </AppContainer>,
        document.getElementById('react-root')
      );
    });
  }
});
