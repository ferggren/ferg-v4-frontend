'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Block, BlockTitle } from 'components/ui';
import { niceMonthFormat } from 'libs/nice-time';
import './styles';

const propTypes = {
  photo: PropTypes.object.isRequired,
};

class PhotoDetails extends React.PureComponent {
  makeTitle() {
    const photo = this.props.photo;

    if (!photo.title) return null;

    return (
      <Block>
        <BlockTitle>
          {photo.title}
        </BlockTitle>
      </Block>
    );
  }

  makeDate() {
    const photo = this.props.photo;

    if (!photo.timestamp) return null;

    return (
      <Block>
        {niceMonthFormat(photo.timestamp)}
      </Block>
    );
  }

  makeDesc() {
    return null;
  }

  makeComments() {
    return null;
  }

  render() {
    return (
      <div>
        {this.makeTitle()}
        {this.makeDate()}
        {this.makeDesc()}
        {this.makeComments()}
      </div>
    );
  }
}

PhotoDetails.propTypes = propTypes;

export default PhotoDetails;
