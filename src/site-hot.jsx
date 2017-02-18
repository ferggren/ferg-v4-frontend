'use strict';

/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers/site';
import onload from 'libs/onload';
import { AppContainer } from 'react-hot-loader';
import { Site } from 'containers/site';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});

  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  ReactDOM.render(
    <AppContainer>
      <Site />
    </AppContainer>,
    document.getElementById('react-root')
  );

  if (module.hot) {
    module.hot.accept('./containers/site', () => {
      const NewSite = require('containers/site').Site;

      ReactDOM.render(
        <AppContainer>
          <NewSite />
        </AppContainer>,
        document.getElementById('react-root')
      );
    });
  }
});
