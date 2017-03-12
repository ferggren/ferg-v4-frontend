'use strict';

/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// env
const WEBPACK_MODE = process.env.WEBPACK_MODE || 'build';
const NODE_ENV = process.env.NODE_ENV || 'production';
const NODE_MODE = 'client';

// config
const WEBPACK_ENTRY = {
  ferg: ['ferg'],
  admin: ['admin'],
};
const PUBLIC_PATH = '/assets/';
const CONTENT_BASE = './public';
const SOURCE_PATH = './src';
const OUTPUT_JS = '[name].js';
const OUTPUT_CSS = '[name].css';
const OUTPUT_FONTS = '[hash].[ext]';
const OUTPUT_MEDIA = '[hash].[ext]';
const EXTRACT_CSS = true;

// dev server & proxy settings
const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 8081;
const DEV_SERVER_HOST = process.env.DEV_SERVER_HOST || 'ferg.dev';
const DEV_SERVER_PROXY_PORT = process.env.DEV_SERVER_PROXY_PORT || 8080;
const DEV_SERVER_PROXY_HOST = process.env.DEV_SERVER_PROXY_HOST || 'ferg.dev';

// build paths
const ROOT_PATH = path.join(__dirname, SOURCE_PATH);
const BUILD_PATH = path.join(__dirname, `${CONTENT_BASE}${PUBLIC_PATH}`);

// define globals
global.WEBPACK_ENTRY = WEBPACK_ENTRY;
global.ROOT_PATH = ROOT_PATH;
global.BUILD_PATH = BUILD_PATH;
global.PUBLIC_PATH = PUBLIC_PATH;
global.NODE_ENV = NODE_ENV;
global.NODE_ENV = NODE_ENV;
global.NODE_MODE = NODE_MODE;
global.WEBPACK_MODE = WEBPACK_MODE;
global.DEV_SERVER_HOST = DEV_SERVER_HOST;
global.DEV_SERVER_PORT = DEV_SERVER_PORT;
global.OUTPUT_JS = OUTPUT_JS;
global.OUTPUT_CSS = OUTPUT_CSS;
global.OUTPUT_FONTS = OUTPUT_FONTS;
global.OUTPUT_MEDIA = OUTPUT_MEDIA;
global.EXTRACT_CSS = EXTRACT_CSS;

// init webpack with config
const compiler = webpack(require('./webpack/config'));

// build bundle
if (WEBPACK_MODE === 'build') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log(stats.toString({ chunks: false, colors: true }));
  });
}

// build bundle & watch updates
if (WEBPACK_MODE === 'watch') {
  compiler.watch(
    { aggregateTimeout: 300, poll: true },
    (err, stats) => {
      if (err) throw new Error(err);
      console.log(stats.toString({ chunks: false, colors: true }));
    }
  );
}

// run webpack-dev-server
if (WEBPACK_MODE === 'server') {
  let proxy = false;
  const config = {
    hot: true,
    historyApiFallback: true,
    compress: true,
    quiet: false,
    noInfo: false,
    publicPath: PUBLIC_PATH,
    contentBase: [
      CONTENT_BASE,
      `${CONTENT_BASE}${PUBLIC_PATH}`,
    ],
    stats: { 
      assets: true,
      timings: true,
      warnings: true,
      chunks: false,
      colors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  };

  if (DEV_SERVER_PROXY_HOST && DEV_SERVER_PROXY_PORT) {
    proxy = `http://${DEV_SERVER_PROXY_HOST}:${DEV_SERVER_PROXY_PORT}`;
    config.proxy = { '**': proxy };
  }

  const server = new WebpackDevServer(compiler, config);

  server.listen(DEV_SERVER_PORT, DEV_SERVER_HOST, (err) => {
    if (err) throw new Error(err);

    console.log(`Listening at ${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`);
    if (proxy) console.log(`Proxying to ${proxy}`);
  });
}

// profiler
if (WEBPACK_MODE === 'profile') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log('%j', stats.toJson());
  });
}
