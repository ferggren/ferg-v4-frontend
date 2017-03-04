'use strict';

import React from 'react';
import { AppContainer } from 'components/app';
import TitleWatcher from 'containers/title-watcher';
import LocationWatcher from 'containers/location-watcher';
import RequestProgress from 'containers/request-progress';
import SiteNavigation from './site-navigation';
import SiteFooter from './site-footer';

const propTypes = {
  children: React.PropTypes.node,
};

const defaultProps = {
  children: null,
};

class SiteContainer extends React.PureComponent {
  render() {
    return (
      <AppContainer>
        <SiteNavigation />
        
        <LocationWatcher />
        <TitleWatcher />
        <RequestProgress />

        {this.props.children}

        <SiteFooter />
      </AppContainer>
    );
  }
}

SiteContainer.propTypes = propTypes;
SiteContainer.defaultProps = defaultProps;

export default SiteContainer;
