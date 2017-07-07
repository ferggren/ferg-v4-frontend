'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentWrapper } from 'components/ui';
import { titleSet } from 'actions/title';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('route-photostream', langRu, 'ru');
Lang.updateLang('route-photostream', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

class AdminPhotostream extends React.PureComponent {
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

  updateTitle() {
    this.props.dispatch(titleSet(Lang('route-photostream.title')));
  }

  render() {
    return (
      <ContentWrapper>
        AdminPhotostream
      </ContentWrapper>
    );
  }
}

AdminPhotostream.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(AdminPhotostream);
