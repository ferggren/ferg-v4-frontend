'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Request from 'libs/request';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { closeModal } from 'actions/modals';
import { ContentWrapper } from 'components/ui';
import Loader from 'components/loader';
import './styles';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

const defaultProps = {
  tag: '',
};

class PhotolibraryModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.request = false;

    this.state = {
      loading: false,
      info: false,
      error: false,
    };

    this.onClick = this.onClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.loadInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id || prevProps.tag !== this.props.tag) {
      this.loadInfo();
    }
  }

  componentWillUnmount() {
    if (this.request) {
      Request.abort(this.request);
      this.request = false;
    }
  }

  onClick(e) {
    const info = this.state.info;
    let url = `/${this.props.lang}/photostream/${info.id}`;

    if (this.props.tag) {
      url += `?tag=${encodeURIComponent(this.props.tag)}`;
    }

    browserHistory.push(url);

    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(closeModal('PHOTOLIBRARY'));
  }

  closeModal(e) {
    if (e.target.className !== 'image-modal') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    this.props.dispatch(closeModal('IMAGE'));
  }

  loadInfo() {
    if (this.request) {
      Request.abort(this.request);
      this.request = false;
    }

    this.setState({ loading: true, info: false, error: false });

    this.request = Request.fetch('/api/photostream/getPhoto', {
      method: 'POST',

      success: (data) => {
        this.setState({ loading: false });

        if (!data || !data.info) {
          return;
        }

        this.setState({ info: data.info });
      },

      error: (error) => {
        this.setState({ loading: false, error });
      },

      data: {
        USER_LANG: this.props.lang,
        id: this.props.id,
        tag: this.props.tag || '',
        cache: true,
      },
    });
  }

  makeImage() {
    const info = this.state.info;

    if (!info) {
      return null;
    }

    let url = `/${this.props.lang}/photostream/${info.id}`;

    if (this.props.tag) {
      url += `?tag=${encodeURIComponent(this.props.tag)}`;
    }

    const linkProps = {
      className: 'image-modal__link',
      onClick: this.onClick,
      href: url,
    };

    const imageProps = {
      className: 'image-modal__image',
      src: info.photo_big,
    };

    if (info.width) imageProps.width = info.width;
    if (info.height) imageProps.height = info.height;

    return (
      <a {...linkProps}>
        <img {...imageProps} />
      </a>
    );
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return <ContentWrapper>{this.state.error}</ContentWrapper>;
  }

  render() {
    return (
      <div className="image-modal" onClick={this.closeModal}>
        {this.makeLoader()}
        {this.makeError()}
        {this.makeImage()}
      </div>
    );
  }
}

PhotolibraryModal.propTypes = propTypes;
PhotolibraryModal.defaultProps = defaultProps;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(PhotolibraryModal);
