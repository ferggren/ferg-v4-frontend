'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from 'actions/modals';
import './styles';

const propTypes = {
  src: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  href: false,
  to: false,
  width: false,
  height: false,
};

class ImageModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onClick(e) {
    if (this.props.href || this.props.to) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(closeModal('IMAGE'));
  }

  closeModal(e) {
    if (e.target.className !== 'image-modal') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    this.props.dispatch(closeModal('IMAGE'));
  }

  render() {
    const linkProps = {
      className: 'image-modal__link',
      onClick: this.onClick,
    };

    const imageProps = {
      className: 'image-modal__image',
      src: this.props.src,
    };

    if (this.props.href) linkProps.href = this.props.href;
    if (this.props.to) linkProps.to = this.props.to;
    if (this.props.width) imageProps.width = this.props.width;
    if (this.props.height) imageProps.height = this.props.height;

    return (
      <div className="image-modal" onClick={this.closeModal}>
        <a {...linkProps}>
          <img {...imageProps} />
        </a>
      </div>
    );
  }
}

ImageModal.propTypes = propTypes;
ImageModal.defaultProps = defaultProps;

export default connect(() => {
  return {

  };
})(ImageModal);
