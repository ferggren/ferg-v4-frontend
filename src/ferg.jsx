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
import GOOGLE_API_KEY from 'data/google-api-key.js';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});

  Lang.setLang(store.getState().lang);
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);

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
        const NewFerg = require('containers/ferg-app').default;

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
