'use strict';

import React from 'react';
import { AppContainer } from 'components/app';
import AdminTitleWatcher from 'containers/admin-title-watcher';
import LocationWatcher from 'containers/location-watcher';
import RequestProgress from 'containers/request-progress';
import AdminNavigation from 'containers/admin-navigation';
import AdminFooter from 'containers/admin-footer';

const propTypes = {
  children: React.PropTypes.node,
};

const defaultProps = {
  children: null,
};

class AdminContainer extends React.PureComponent {
  render() {
    return (
      <AppContainer>
        <AdminNavigation />
        
        <LocationWatcher />
        <AdminTitleWatcher />
        <RequestProgress />

        {this.props.children}

        <AdminFooter />
      </AppContainer>
    );
  }
}

AdminContainer.propTypes = propTypes;
AdminContainer.defaultProps = defaultProps;

export default AdminContainer;
