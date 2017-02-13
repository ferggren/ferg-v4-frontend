'use strict';

global.SCRIPT_ENV = 'server';
global.NODE_ENV = process.env.NODE_ENV || 'production';
global.NODE_PORT = process.env.PORT || 3000;
global.API_HOST = process.env.API_HOST || 'http://ferg.dev';

const extensions_ignore = [
  'css',
  'less',
  'sass',
  'scss',
  'ttf',
  'woff',
  'woff2',
];

extensions_ignore.forEach((ext) => {
  require.extensions[`.${ext}`] = () => {};
});

require('babel-core/register');
require('babel-polyfill');
require('./src/node-server');
