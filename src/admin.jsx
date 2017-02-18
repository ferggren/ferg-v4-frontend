'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'reducers/admin';
import onload from 'libs/onload';
import { Admin } from 'containers/admin';

onload(() => {
  const store = configureStore(window.REDUX_INITIAL_STATE || {});
  
  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  ReactDOM.render(
    <Admin />,
    document.getElementById('react-root')
  );
});
