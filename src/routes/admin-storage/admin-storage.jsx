'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ContentWrapper } from 'components/ui';
import { titleSet } from 'actions/title';
import Storage from 'components/storage';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('route-storage', langRu, 'ru');
Lang.updateLang('route-storage', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

class AdminStorage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onFileSelect = this.onFileSelect.bind(this);
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

  onFileSelect(file) {
    const win = window.open(file.link_download, '_blank');
    win.focus();
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang('route-storage.title')));
  }

  render() {
    return (
      <ContentWrapper>
        <Storage 
          onFileSelect={this.onFileSelect}
          mediaTypes="all"
          upload_access="public"
          group="storage"
          lang={this.props.lang}
        />
      </ContentWrapper>
    );
  }
}

AdminStorage.propTypes = propTypes;

export default connect((state) => {
  return {
    lang: state.lang,
  };
})(AdminStorage);
