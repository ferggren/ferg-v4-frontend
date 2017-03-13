'use strict';

/**
 *  Find all fetchData and make a promise
 *
 *  @param {object} store App store
 *  @param {object} components React router components
 *  @param {object} params Params for fetchData
 *  @return {object} Promise
 */
export function fetchComponentsData(store, components, params) {
  let needs = [];

  components.forEach((component) => {
    while (component) {
      if (typeof component.fetchData === 'function') {
        needs = needs.concat(component.fetchData(store, params));
      }

      component = component.WrappedComponent;
    }
  });

  return Promise.all(needs);
}

export function fetchRoutesData(store, routes, params) {
  let needs = [];

  routes.forEach((route) => {
    let component = route.component;

    while (component) {
      if (typeof component.fetchData === 'function') {
        needs = needs.concat(component.fetchData(store, params));
      }

      component = component.wrappedComponent;
    }
  });

  return needs;
}

export function makeFetchParams(query, params, location) {
  const ret = {};

  Object.keys(query).forEach((key) => {
    ret[key] = query[key];
  });

  Object.keys(params).forEach((param) => {
    ret[param] = params[param];
  });

  ret.location = location;

  return ret;
}
