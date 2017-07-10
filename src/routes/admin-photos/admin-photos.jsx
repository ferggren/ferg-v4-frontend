'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentWrapper } from 'components/ui';
import { titleSet } from 'actions/title';
import PhotoLibrary from 'components/photolibrary';
import Request from 'libs/request';
import Lang from 'libs/lang';
import { openModal } from 'actions/modals';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('route-photos', langRu, 'ru');
Lang.updateLang('route-photos', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

class AdminPhotos extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.request = false;

    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.updateTitle();
    }
  }

  componentWillUnmount() {
    if (this.request) {
      Request.abort(this.request);
      this.request = false;
    }
  }

  onSelect(photo) {
    if (this.request) {
      Request.abort(this.request);
    }

    this.setState({ loading: true });

    this.request = Request.fetch(
      '/api/adminphotos/getPhotoUrl', {
        method: 'POST',

        success: (data) => {
          this.props.dispatch(openModal({
            type: 'IMAGE',
            data: {
              src: data.src,
              width: data.width || 0,
              height: data.height || 0,
              href: data.src,
            },
            replace: true,
            style: 'minimal',
          }));

          this.setState({ loading: false });
          this.request = false;
        },

        error: () => {
          this.setState({ loading: false });
          this.request = false;
        },

        data: { photo_id: photo[0] },
      }
    );
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('route-photos.title')));
  }

  render() {
    return (
      <ContentWrapper>
        <PhotoLibrary
          onSelect={this.onSelect}
          lang={this.props.lang}
        />
      </ContentWrapper>
    );
  }
}

AdminPhotos.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(AdminPhotos);
