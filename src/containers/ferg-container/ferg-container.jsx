'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'components/ui';
import LocationWatcher from 'containers/location-watcher';
import RequestProgress from 'containers/request-progress';
import TitleWatcher from 'containers/ferg-title-watcher';
import Tracker from 'containers/tracker';
import FergNavigation from 'containers/ferg-navigation';
import FergFooter from 'containers/ferg-footer';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

class FergContainer extends React.PureComponent {
  render() {
    return (
      <Container>
        <FergNavigation />
        
        <LocationWatcher />
        <TitleWatcher />
        <RequestProgress />
        <Tracker />

        <div>
          {this.props.children}
        </div>

        <FergFooter />
      </Container>
    );
  }
}

FergContainer.propTypes = propTypes;
FergContainer.defaultProps = defaultProps;

export default FergContainer;
