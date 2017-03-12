'use strict';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import siteRoutes from 'routes/ferg';

class Site extends React.Component {
  render() {
    return (
      <Provider store={window.REDUX_STORE}>
        <Router history={browserHistory}>
          {siteRoutes}
        </Router>
      </Provider>
    );
  }
}

export default Site;
