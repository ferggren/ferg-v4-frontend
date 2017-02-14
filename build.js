'use strict';

/* eslint no-console: "off" */
const {
  WEBPACK_MODE,
  DEV_SERVER_PROXY_HOST,
  DEV_SERVER_PROXY_PORT,
  DEV_SERVER_PORT,
  DEV_SERVER_HOST,
  PUBLIC_PATH,
} = require('./webpack/constants');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack/config');

const compiler = webpack(config);

if (WEBPACK_MODE === 'build') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log(stats.toString({ chunks: false, colors: true }));
  });
}

if (WEBPACK_MODE === 'watch') {
  compiler.watch(
    { aggregateTimeout: 300, poll: true },
    (err, stats) => {
      if (err) throw new Error(err);
      console.log(stats.toString({ chunks: false, colors: true }));
    }
  );
}

if (WEBPACK_MODE === 'server') {
  const server = new WebpackDevServer(compiler, {
    hot: true,
    historyApiFallback: true,
    compress: true,
    proxy: {
      '**': `http://${DEV_SERVER_PROXY_HOST}:${DEV_SERVER_PROXY_PORT}`,
    },
    quiet: false,
    noInfo: false,
    publicPath: PUBLIC_PATH,
    stats: { colors: true },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  });

  server.listen(DEV_SERVER_PORT, DEV_SERVER_HOST, (err) => {
    if (err) console.log(err);
    console.log(`Listening at ${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`);
    console.log(`Proxying to http://${DEV_SERVER_PROXY_HOST}:${DEV_SERVER_PROXY_PORT}`);
  });
}

if (WEBPACK_MODE === 'profile') {
  compiler.run((err, stats) => {
    if (err) throw new Error(err);
    console.log('%j', stats.toJson());
  });
}
