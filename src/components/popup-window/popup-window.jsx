'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Popup from 'components/popup';
import './styles';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

const defaultProps = {
  title: '',
};

class PopupWindow extends React.PureComponent {
  makeTitle() {
    if (!this.props.title) return null;

    return (
      <div className="popup__window-title">
        {this.props.title}
      </div>
    );
  }

  render() {
    return (
      <Popup onClose={this.props.onClose}>
        <div className="popup__window">
          <div className="popup__window-close" onClick={this.props.onClose} />

          {this.makeTitle()}

          <div className="popup__window-content">
            {this.props.children}
          </div>
        </div>
      </Popup>
    );
  }
}

PopupWindow.propTypes = propTypes;
PopupWindow.defaultProps = defaultProps;

export default PopupWindow;
