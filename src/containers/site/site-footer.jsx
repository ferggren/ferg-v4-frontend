'use strict';

import React from 'react';
import { AppFooter } from 'components/app';

class SiteFooter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectLang = this.selectLang.bind(this);
  }

  selectLang(new_lang) {
    console.log(`select lang ${new_lang}`);
  }

  render() {
    return (
      <AppFooter onLangSelect={this.selectLang} />
    );
  }
}

export default SiteFooter;
