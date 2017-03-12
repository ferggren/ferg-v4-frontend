'use strict';

/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers';
import onload from 'libs/onload';
import Lang from 'libs/lang';
import Ferg from 'containers/ferg-app';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});

  Lang.setLang(store.getState().lang);
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    ReactDOM.render(
      <AppContainer>
        <Ferg />
      </AppContainer>,
      document.getElementById('react-root')
    );

    if (typeof module !== 'undefined' && module.hot) {
      module.hot.accept('./containers/ferg-app', () => {
        const NewFerg = require('containers/ferg-app');

        ReactDOM.render(
          <AppContainer>
            <NewFerg />
          </AppContainer>,
          document.getElementById('react-root')
        );
      });
    }
    
    return;
  }

  ReactDOM.render(
    <Ferg />,
    document.getElementById('react-root')
  );
});
