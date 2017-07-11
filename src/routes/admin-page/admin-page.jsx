'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import { PageEditor } from 'components/page';
import { connect } from 'react-redux';
import { ContentWrapper } from 'components/ui';
import { titleSet } from 'actions/title';
import { getPagesType } from 'libs/pages';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';

Lang.updateLang('admin-page', langRu, 'ru');
Lang.updateLang('admin-page', langEn, 'en');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  page_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

class AdminPage extends React.PureComponent {
  componentWillMount() {
    this.updateTitle();
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang ||
        prevProps.type !== this.props.type
        ) {
      this.updateTitle();
    }
  }

  updateTitle() {
    this.props.dispatch(titleSet(Lang(`admin-page.${this.props.type}-title`)));
  }

  render() {
    return (
      <ContentWrapper>
        <PageEditor
          page_id={this.props.page_id}
          type={this.props.type}
          lang={this.props.lang}
        />
      </ContentWrapper>
    );
  }
}

AdminPage.propTypes = propTypes;

export default connect((state, props) => {
  return {
    lang: state.lang,
    type: getPagesType(state.location),
    page_id: props.params.id || false,
  };
})(AdminPage);
