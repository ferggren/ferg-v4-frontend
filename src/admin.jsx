'use strict';

/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers';
import onload from 'libs/onload';
import Lang from 'libs/lang';
import Admin from 'containers/admin-app';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});
  
  Lang.setLang(store.getState().lang);
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    ReactDOM.render(
      <AppContainer>
        <Admin />
      </AppContainer>,
      document.getElementById('react-root')
    );

    if (module.hot) {
      module.hot.accept('./containers/admin-app', () => {
        const NewAdmin = require('containers/admin-app').default;

        ReactDOM.render(
          <AppContainer>
            <NewAdmin />
          </AppContainer>,
          document.getElementById('react-root')
        );
      });
    }
    return;
  }

  ReactDOM.render(
    <Admin />,
    document.getElementById('react-root')
  );
});
