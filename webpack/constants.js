'use strict';

const path = require('path');

const WEBPACK_MODE = process.env.WEBPACK_MODE || 'build';
const NODE_ENV = process.env.NODE_ENV || 'production';
const ROOT_PATH = path.join(`${__dirname}/../`, '/src');
const PUBLIC_PATH = '/assets/';
const BUILD_PATH = path.join(`${__dirname}/../`, '/public' + PUBLIC_PATH);
const NODE_MODE = 'client';

const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 8081;
const DEV_SERVER_HOST = process.env.DEV_SERVER_HOST || 'ferg.dev';
const DEV_SERVER_PROXY_PORT = process.env.DEV_SERVER_PROXY_PORT || 8080;
const DEV_SERVER_PROXY_HOST = process.env.DEV_SERVER_PROXY_HOST || 'ferg.dev';

module.exports = {
  WEBPACK_MODE,
  NODE_ENV,
  ROOT_PATH,
  PUBLIC_PATH,
  BUILD_PATH,
  NODE_MODE,
  DEV_SERVER_PORT,
  DEV_SERVER_HOST,
  DEV_SERVER_PROXY_PORT,
  DEV_SERVER_PROXY_HOST,
};
