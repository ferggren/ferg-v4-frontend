'use strict';

/* global WEBPACK_ENTRY */
/* global ROOT_PATH */
/* global BUILD_PATH */
/* global PUBLIC_PATH */
/* global NODE_ENV */
/* global NODE_MODE */
/* global WEBPACK_MODE */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const insertHMR = require('./insert-hmr');

const webpackConfig = {
  context: ROOT_PATH,
  entry: WEBPACK_ENTRY,
  resolve: {
    modules: [ROOT_PATH, 'node_modules'],
    extensions: ['.js', '.jsx', '.css', '.sass', '.scss', '.less'],
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    chunkFilename: '[id].js?[hash]',
    publicPath: PUBLIC_PATH,
  },
  devtool: (NODE_ENV === 'dev') ? 'cheap-module-eval-source-map' : false,
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: [
            ['es2015', { modules: false }],
            'stage-2',
            'react',
          ],
          plugins: (WEBPACK_MODE === 'server' ? ['react-hot-loader/babel'] : []),
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: `css-loader?minimize!sass-loader?includePaths[]=${ROOT_PATH}`,
        }),
      },
      {
        test: /\.gif$/,
        use: 'url-loader?limit=4096&mimetype=image/gif',
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=4096&mimetype=image/jpg',
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=4096&mimetype=image/png',
      },
      {
        test: /\.svg/,
        loader: 'url-loader?limit=4096&mimetype=image/svg+xml',
      },
      {
        test: /\.(woff|woff2|ttf|eot)/,
        loader: 'url-loader?limit=1',
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      NODE_MODE: JSON.stringify(NODE_MODE),
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        NODE_MODE: JSON.stringify(NODE_MODE),
      },
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
      disable: (NODE_ENV === 'dev'),
    }),
  ],
};

// Additional config for production
// UglifyJsPlugin & DedupePlugin
if (NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      warnings: false,
      drop_console: false,
      comments: false,
      sourceMap: false,
      output: {
        comments: false,
      },
      compressor: {
        warnings: false,
      },
    })
  );
}

// Additional config for dev-server
if (WEBPACK_MODE === 'server') {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin()
  );

  webpackConfig.entry = insertHMR(webpackConfig.entry);
}

module.exports = webpackConfig;
