'use strict';

/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers';
import onload from 'libs/onload';
import Lang from 'libs/lang';
import { Site } from 'containers/site';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});

  Lang.setLang(store.getState().lang);
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    ReactDOM.render(
      <AppContainer>
        <Site />
      </AppContainer>,
      document.getElementById('react-root')
    );

    if (typeof module !== 'undefined' && module.hot) {
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
    
    return;
  }

  ReactDOM.render(
    <Site />,
    document.getElementById('react-root')
  );
});
