'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'components/ui';
import AdminTitleWatcher from 'containers/admin-title-watcher';
import LocationWatcher from 'containers/location-watcher';
import Modals from 'containers/modals';
import RequestProgress from 'containers/request-progress';
import AdminNavigation from 'containers/admin-navigation';
import AdminFooter from 'containers/admin-footer';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

class AdminContainer extends React.PureComponent {
  render() {
    return (
      <Container>
        <AdminNavigation />
        
        <LocationWatcher />
        <AdminTitleWatcher />
        <RequestProgress />
        <Modals />

        <div>
          {this.props.children}
        </div>

        <AdminFooter />
      </Container>
    );
  }
}

AdminContainer.propTypes = propTypes;
AdminContainer.defaultProps = defaultProps;

export default AdminContainer;
