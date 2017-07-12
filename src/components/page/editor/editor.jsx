'use strict';

/* Here you can find a lot of legacy code */

import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libs/lang';
import Loader from 'components/loader';
import { Grid, GridItem, Block, FormInputText, FormCallout } from 'components/ui';
import TagsSelector from 'components/tags-selector';
import PopupWindow from 'components/popup-window';
import { MediaEditor } from 'components/media';
import LocationPicker from 'components/location-picker';
import Request from 'libs/request';
import deepClone from 'libs/deep-clone';
import PageEditorPreview from './components/preview';
import langRu from './lang/ru';
import langEn from './lang/en';
import './styles';

const TAGS_WIDTH = '200px';

Lang.updateLang('page-editor', langRu, 'ru');
Lang.updateLang('page-editor', langEn, 'en');

const propTypes = {
  lang: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  page_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

class PageEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      page: false,
      loading: false,
      tags: false,
      show_location_popup: false,
    };

    this.requests = {};

    this.updatePageInfo = this.updatePageInfo.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.updateGps = this.updateGps.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.showLocationPopup = this.showLocationPopup.bind(this);
    this.hideLocationPopup = this.hideLocationPopup.bind(this);
    this.updatePreview = this.updatePreview.bind(this);
  }

  componentDidMount() {
    this.loadPage();
    this.loadTags();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang ||
        prevProps.type !== this.props.type ||
        prevProps.page_id !== this.props.page_id) {
      this.loadPage();
      this.loadTags();
    }
  }

  componentWillUnmount() {
    Object.keys(this.requests).forEach((request) => {
      if (!this.requests[request]) {
        return;
      }

      Request.abort(this.requests[request]);
      this.requests[request] = false;
    });

    this.requests = {};
  }

  showLocationPopup() {
    this.setState({ show_location_popup: true });
  }

  hideLocationPopup() {
    this.setState({ show_location_popup: false });
  }

  loadPage() {
    if (!this.props.page_id) {
      this.setState({ loading: false, page: false, error: false });
      return;
    }

    this.setState({ loading: false, page: false, error: false });

    if (this.requests.page) {
      Request.abort(this.requests.page);
    }

    this.requests.page = Request.fetch(
      '/api/pages/getPage/', {
        method: 'POST',

        success: (page) => {
          this.requests.page = null;
          this.setState({ page, loading: false });
        },

        error: (error) => {
          this.requests.page = null;
          this.setState({ loading: false, error });
        },

        data: {
          type: this.props.type,
          id: this.props.page_id,
        },
      }
    );
  }

  loadTags() {
    if (this.requests.tags) {
      Request.abort(this.requests.tags);
    }

    this.requests.tags = Request.fetch(
      '/api/pages/getTags/', {
        method: 'POST',

        success: (tags) => {
          this.requests.tags = null;
          this.setState({ tags });
        },

        error: (error) => {
          this.requests.tags = null;
          this.setState({ error });
        },

        data: {
          type: this.props.type,
          visible: 'all',
          return: 'full',
        },
      }
    );
  }

  updatePreview(photo_id) {
    if (this.state.loading) {
      return;
    }

    if (this.requests.update) {
      Request.abort(this.requests.update);
    }

    this.setState({ loading: true, error: false });

    this.requests.update = Request.fetch(
      '/api/pages/updatePhoto/', {
        method: 'POST',

        success: (preview) => {
          this.requests.update = null;

          const page = deepClone(this.state.page);
          page.preview = preview;

          this.setState({ page, loading: false });
        },

        error: (error) => {
          this.requests.update = null;
          this.setState({ loading: false, error });
        },

        data: {
          type: this.props.type,
          id: this.props.page_id,
          photo_id,
        },
      }
    );
  }

  updateDate(date) {
    if (this.state.loading || date === this.state.page.date) {
      return;
    }

    if (!date.match(/^\d{4}\.\d{1,2}\.\d{1,2}$/)) {
      this.setState({ error: 'invalid_date' });
      return;
    }

    if (this.requests.update) {
      Request.abort(this.requests.update);
    }

    this.setState({ loading: true, error: false });

    this.requests.update = Request.fetch(
      '/api/pages/updateDate/', {
        method: 'POST',
        
        success: (response) => {
          this.requests.update = null;

          const page = deepClone(this.state.page);
          page.date = response.date;
          page.timestamp = response.timestamp;

          this.setState({ page, loading: false });
        },

        error: (error) => {
          this.requests.update = null;
          this.setState({ loading: false, error });
        },

        data: {
          type: this.props.type,
          id: this.props.page_id,
          date,
        },
      }
    );
  }

  updateGps(gps) {
    if (this.state.loading || gps === this.state.page.gps) {
      return;
    }

    if (gps && !gps.match(/^-?\d+\.\d+\s+-?\d+\.\d+$/)) {
      this.setState({ error: 'invalid_gps' });
      return;
    }
    
    if (this.requests.update) {
      Request.abort(this.requests.update);
    }

    this.setState({ loading: true, error: false });

    this.requests.update = Request.fetch(
      '/api/pages/updateGps/', {
        method: 'POST',
        
        success: (response) => {
          this.requests.update = null;

          const page = deepClone(this.state.page);
          page.gps = response.gps;

          this.setState({ page, loading: false });
        },

        error: (error) => {
          this.requests.update = null;
          this.setState({ loading: false, error });
        },

        data: {
          type: this.props.type,
          id: this.props.page_id,
          gps: gps || '',
        },
      }
    );
  }

  updateLocation(location) {
    this.updateGps(`${location.lat} ${location.lng}`);
  }

  updateTag(tag, value) {
    if (this.state.loading) {
      return;
    }

    if (this.requests.update) {
      Request.abort(this.requests.update);
    }

    this.setState({ loading: true, error: false });

    this.requests.update = Request.fetch(
      '/api/pages/updateTags/', {
        method: 'POST',

        success: (response) => {
          this.requests.update = null;

          const page = deepClone(this.state.page);
          page.tags = response.page_tags;
          page.location = response.page_location;

          this.setState({
            tags: response.tags,
            loading: false,
            page,
          });
        },

        error: (error) => {
          this.requests.update = null;
          this.setState({ loading: false, error });
        },

        data: {
          type: this.props.type,
          id: this.props.page_id,
          tag,
          value,
        },
      }
    );
  }

  updatePageInfo() {
    if (this.requests.update_versions) {
      Request.abort(this.requests.update_versions);
    }

    this.requests.update = Request.fetch(
      '/api/pages/updateVersions/', {
        method: 'POST',

        success: () => {
          this.requests.update_versions = null;
        },

        error: () => {
          this.requests.update_versions = null;
        },

        data: {
          id: this.props.page_id,
        },
      }
    );
  }

  makeTagsList() {
    if (!this.state.page || !this.state.tags) {
      return <Block><Loader /></Block>;
    }

    const ret = [];

    Object.keys(this.state.tags).forEach((group) => {
      ret.push(
        <Block key={`${group}_selector`}>
          <TagsSelector
            tag={group}
            name={Lang(`page-editor.tags_${group}`)}
            value={this.state.page[group] || ''}
            values={Object.keys(this.state.tags[group])}
            multiple={group === 'tags'}
            onSelect={this.updateTag}
            lang={this.props.lang}
          />
        </Block>
      );
    });

    return ret;
  }

  makeLocationPopup() {
    if (!this.state.show_location_popup) {
      return null;
    }

    return (
      <PopupWindow onClose={this.hideLocationPopup}>
        <LocationPicker
          location={this.state.page.gps}
          onChange={this.updateLocation}
          className="page-editor__location-picker"
        />
      </PopupWindow>
    );
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <Block>
        <FormCallout>
          {Lang(`page-editor.error_${this.state.error}`)}
        </FormCallout>
      </Block>
    );
  }

  render() {
    if (!this.state.page) {
      return <Block><Loader /></Block>;
    }

    return (
      <div>
        {this.makeLocationPopup()}

        <Block>
          <Grid justifyContent="space-between">
            <GridItem width={`calc(100% - ${TAGS_WIDTH} - 30px)`}>
              {this.makeError()}

              <Block>
                <PageEditorPreview
                  page={this.state.page}
                  lang={this.props.lang}
                  loading={this.state.loading}
                  onSelect={this.updatePreview}
                />
              </Block>

              <Block>
                <Block>
                  <FormInputText
                    type="text"
                    name="date"
                    value={this.state.page.date}
                    placeholder={Lang('page-editor.page_date')}
                    disabled={this.state.loading}
                    onSubmit={this.updateDate}
                    onBlur={this.updateDate}
                  />
                </Block>
              </Block>

              <Block>
                <FormInputText
                  type="text"
                  name="gps"
                  value={this.state.page.gps}
                  placeholder={Lang('page-editor.page_gps')}
                  disabled={this.state.loading}
                  onSubmit={this.updateGps}
                  onBlur={this.updateGps}
                />
              </Block>

              <Block>
                <LocationPicker
                  location={this.state.page.gps}
                  showControls={false}
                  onClick={this.showLocationPopup}
                  height="100px"
                />
              </Block>
            </GridItem>

            <GridItem width={TAGS_WIDTH}>
              {this.makeTagsList()}
            </GridItem>
          </Grid>
        </Block>

        <Block>
          <MediaEditor
            onUpdate={this.updatePageInfo}
            entry_key={`page_${this.state.page.id}`}
            lang={this.props.lang}
            langs={[
              this.props.lang,
              this.props.lang === 'en' ? 'ru' : 'en',
            ]}
          />
        </Block>
      </div>
    );
  }
}

PageEditor.propTypes = propTypes;

export default PageEditor;
