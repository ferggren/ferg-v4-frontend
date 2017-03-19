'use strict';

import React from 'react';
import { AppContent, AppContentTitle } from 'components/app';
import { niceMonthFormat } from 'libs/nice-time';
import './styles';

const propTypes = {
  photo: React.PropTypes.object.isRequired,
};

class PhotoDetails extends React.PureComponent {
  makeTitle() {
    const photo = this.props.photo;

    if (!photo.title) return null;

    return (
      <AppContent>
        <AppContentTitle>
          {photo.title}
        </AppContentTitle>
      </AppContent>
    );
  }

  makeDate() {
    const photo = this.props.photo;

    if (!photo.timestamp) return null;

    return (
      <AppContent>
        {niceMonthFormat(photo.timestamp)}
      </AppContent>
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
