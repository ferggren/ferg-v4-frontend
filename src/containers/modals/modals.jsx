'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { closeModal } from 'actions/modals';
import PopupWindow from 'components/popup-window';
import Popup from 'components/popup';
import ModalImage from 'modals/image';
import ModalPhotolibrary from 'modals/photolibrary';

const propTypes = {
  modals: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

class Modals extends React.PureComponent {
  render() {
    const map = {
      IMAGE: ModalImage,
      PHOTOLIBRARY: ModalPhotolibrary,
    };

    const components = this.props.modals.map((modal) => {
      if (!map[modal.type]) return null;

      const Component = map[modal.type];
      const PopupObject = modal.style === 'minimal' ? Popup : PopupWindow;

      return (
        <PopupObject
          key={modal.type}
          onClose={() => {
            this.props.dispatch(closeModal(modal.type));
          }}
        >
          <Provider store={window.REDUX_STORE}>
            <Component {...modal.data} />
          </Provider>
        </PopupObject>
      );
    });

    return (
      <div>
        {components}
      </div>
    );
  }
}

Modals.propTypes = propTypes;

export default connect((state) => {
  return {
    modals: state.modals,
  };
})(Modals);
