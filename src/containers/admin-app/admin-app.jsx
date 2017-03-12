'use strict';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import adminRoutes from 'routes/admin';

class Admin extends React.Component {
  render() {
    return (
      <Provider store={window.REDUX_STORE}>
        <Router history={browserHistory}>
          {adminRoutes}
        </Router>
      </Provider>
    );
  }
}

export default Admin;
