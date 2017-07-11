'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

Lang.updateLang('media-editor', langRu, 'ru');
Lang.updateLang('media-editor', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  entry_key: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  langs: PropTypes.array.isRequired,
};

class MediaEditor extends React.PureComponent {
  render() {
    return (
      <div>
        MediaEditor
      </div>
    );
  }
}

MediaEditor.propTypes = propTypes;

export default MediaEditor;
