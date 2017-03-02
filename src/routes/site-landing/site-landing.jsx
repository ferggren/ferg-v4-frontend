'use strict';

import React from 'react';
import { AppContent } from 'components/app';
import SiteHeader from 'components/site-header';
import './styles';

const propTypes = {

};

const defaultProps = {

};

class SiteLanding extends React.PureComponent {
  render() {
    return (
      <div>
        <AppContent expand overlapHeader contentPadding={false}>
          <SiteHeader />
        </AppContent>

        <AppContent paddingTop>
          Tags
        </AppContent>

        <AppContent paddingTop>
          Feed
        </AppContent>
      </div>
    );
  }
}

SiteLanding.propTypes = propTypes;
SiteLanding.defaultProps = defaultProps;

export default SiteLanding;
