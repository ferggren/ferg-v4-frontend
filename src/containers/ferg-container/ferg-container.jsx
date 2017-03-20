'use strict';

import React from 'react';
import { AppContainer } from 'components/app';
import LocationWatcher from 'containers/location-watcher';
import RequestProgress from 'containers/request-progress';
import TitleWatcher from 'containers/ferg-title-watcher';
import Tracker from 'containers/tracker';
import FergNavigation from 'containers/ferg-navigation';
import FergFooter from 'containers/ferg-footer';

const propTypes = {
  children: React.PropTypes.node,
};

const defaultProps = {
  children: null,
};

class FergContainer extends React.PureComponent {
  render() {
    return (
      <AppContainer>
        <FergNavigation />
        
        <LocationWatcher />
        <TitleWatcher />
        <RequestProgress />
        <Tracker />

        {this.props.children}

        <FergFooter />
      </AppContainer>
    );
  }
}

FergContainer.propTypes = propTypes;
FergContainer.defaultProps = defaultProps;

export default FergContainer;
