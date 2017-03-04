'use strict';

import Request from 'libs/request';

export function apiDataClear(key) {
  return { type: 'API_DATA_CLEAR', key };
}

export function apiErrorDataClear(key) {
  return (dispatch, getState) => {
    const data = getState().api[key];

    if (!data) return;
    if (!data.error) return;

    dispatch(apiDataClear(key));
  };
}

function apiDataInit(key, options) {
  return { type: 'API_DATA_INIT', key, options };
}

function apiRequestAbort(key) {
  return { type: 'API_REQUEST_ABORT', key };
}

function apiRequestSet(key, request) {
  return { type: 'API_REQUEST_SET', key, request };
}

function apiLoadStarted(key) {
  return { type: 'API_LOAD_STARTED', key };
}

function loadLoadError(key, error) {
  return { type: 'API_LOAD_ERROR', key, error };
}

function apiLoadSuccess(key, response) {
  return { type: 'API_LOAD_SUCCESS', key, response };
}

export function apiFetch(key, url, options, clear_data = false) {
  return (dispatch, getState) => {
    if (typeof options !== 'object') options = {};

    dispatch(apiRequestAbort(key));

    const state = getState();

    options.USER_LANG = state.lang;

    if (clear_data) {
      dispatch(apiDataClear(key));
    }

    dispatch(apiDataInit(key, options));
    dispatch(apiLoadStarted(key));

    const promise = new Promise((resolve) => {
      const request = Request.fetch(url, {
        success: (response) => {
          dispatch(apiLoadSuccess(key, response));
          resolve();
        },

        error: (error) => {
          dispatch(loadLoadError(key, error));
          resolve();
        },

        data: options,
        remote_ip: state.ip,
        session: state.session,
      });

      dispatch(apiRequestSet(key, request));
    });

    return promise;
  };
}
