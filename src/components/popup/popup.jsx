'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Popups from 'libs/popups';
import './styles';

const propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

class Popup extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.popup = false;
    this.popup_id = false;
    this.rendered = false;
  }

  componentDidMount() {
    this.popup = Popups.createPopup(this.props.onClose);
    this.popup_id = this.popup.id;
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    ReactDOM.render(
      <div className="popup__root">{this.props.children}</div>,
      this.popup.node
    );
  }

  componentWillUnmount() {
    Popups.niceRemovePopup(this.popup_id, () => {
      ReactDOM.unmountComponentAtNode(this.popup.node);

      this.popup_id = false;
      this.popup = false;
    });
  }

  render() {
    return null;
  }
}

Popup.propTypes = propTypes;

export default Popup;
