'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  onAbort: PropTypes.func.isRequired,
  onAttach: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
  lang: PropTypes.string.isRequired,
};

const defaultProps = {

};

class PhotoLibraryAttachButton extends React.PureComponent {
  render() {
    return (
      <div className="photolibrary__selector">
        <div className="photolibrary__selector-abort" onClick={this.props.onAbort}>
          {Lang('photolibrary.selected_photos_abort', this.props.lang)}
        </div>

        <div className="photolibrary__selector-attach" onClick={this.props.onAttach}>
          {Lang(
            'photolibrary.selected_photos_attach',
            { selected: this.props.selected },
            this.props.lang
          )}
        </div>
      </div>
    );
  }
}

PhotoLibraryAttachButton.propTypes = propTypes;
PhotoLibraryAttachButton.defaultProps = defaultProps;

export default PhotoLibraryAttachButton;
