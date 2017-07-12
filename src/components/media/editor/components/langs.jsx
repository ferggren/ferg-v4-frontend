'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';

const propTypes = {
  lang: PropTypes.string.isRequired,
  entry_lang: PropTypes.string.isRequired,
  entry_langs: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

class MediaEditorLangs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.dataset.lang) {
      return;
    }

    this.props.onSelect(e.target.dataset.lang);
  }

  render() {
    const ret = [];

    this.props.entry_langs.forEach((lang) => {
      const props = {
        onClick: this.onClick,
        className: 'media-editor__lang',
        key: lang,
        'data-lang': lang,
      };

      if (lang === this.props.entry_lang) {
        props.className += ' media-editor__lang--selected';
      }

      ret.push(
        <div {...props}>
          {Lang(`media-editor.lang_${lang}`, this.props.lang)}
        </div>
      );
    });

    return (
      <div className="media-editor__langs">
        {ret}
      </div>
    );
  }
}

MediaEditorLangs.propTypes = propTypes;

export default MediaEditorLangs;
