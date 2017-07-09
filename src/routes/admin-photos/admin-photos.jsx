'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentWrapper } from 'components/ui';
import { titleSet } from 'actions/title';
import { PhotoLibraryList } from 'components/photo-library';
import Lang from 'libs/lang';
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

  onSelect(photo) {
    console.log(photo);
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('route-photos.title')));
  }

  render() {
    return (
      <ContentWrapper>
        <PhotoLibraryList
          onSelect={this.onSelect}
          lang={this.props.lang}
          multiple
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
