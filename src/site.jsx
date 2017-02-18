'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers/site';
import onload from 'libs/onload';
import { Site } from 'containers/site';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  ReactDOM.render(
    <Site />,
    document.getElementById('react-root')
  );
});
