'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { FormInputSelect } from 'components/ui';
import Lang from 'libs/lang';

const propTypes = {
  onPhotostreamChange: PropTypes.func.isRequired,
  photostream: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

const defaultProps = {

};

class PhotoLibraryStreamSwitch extends React.PureComponent {
  render() {
    return (
      <FormInputSelect
        onChange={this.props.onPhotostreamChange}
        value={this.props.photostream}
        values={[
          { text: Lang('photolibrary.switch_all', this.props.lang), value: 'all' },
          { text: Lang('photolibrary.switch_in_photostream', this.props.lang), value: 'in_photostream' },
          { text: Lang('photolibrary.switch_not_in_photostream', this.props.lang), value: 'not_in_photostream' },
        ]}
      />
    );
  }
}

PhotoLibraryStreamSwitch.propTypes = propTypes;
PhotoLibraryStreamSwitch.defaultProps = defaultProps;

export default PhotoLibraryStreamSwitch;
