'use strict';

import React from 'react';
import './styles';

const propTypes = {
  onLangSelect: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.bool,
  ]),
};

const defaultProps = {
  onLangSelect: false,
};

class AppFooter extends React.PureComponent {
  render() {
    return (
      <div className="app-footer__wrapper">
        <div className="app-footer">
          <div className="app-footer__copy">
            ferg.in &copy; 2013 – 2017
          </div>

          <div className="app-footer__lang">
            lang switch
          </div>

          <div style={{ clear: 'both' }} />
        </div>
      </div>
    );
  }
}

AppFooter.propTypes = propTypes;
AppFooter.defaultProps = defaultProps;

export default AppFooter;
