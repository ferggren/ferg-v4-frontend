'use strict';

/* global WEBPACK_ENTRY */
/* global ROOT_PATH */
/* global BUILD_PATH */
/* global PUBLIC_PATH */
/* global NODE_ENV */
/* global NODE_MODE */
/* global WEBPACK_MODE */
/* global EXTRACT_CSS */
/* global OUTPUT_CSS */
/* global OUTPUT_JS */

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
    filename: OUTPUT_JS,
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
        use: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        include: ROOT_PATH,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', { modules: false }],
              'stage-2',
              'react',
            ],
            plugins: (WEBPACK_MODE === 'server' ? ['react-hot-loader/babel'] : []),
          },
        }],
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `css-loader!less-loader?{"relativeUrls":false,"root":"${ROOT_PATH}","paths":["${ROOT_PATH}'"]}`,
        }),
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `css-loader?minimize!sass-loader?includePaths[]=${ROOT_PATH}`,
        }),
      },
      {
        test: /\.gif$/,
        use: 'url-loader?limit=4096&mimetype=image/gif',
      },
      {
        test: /\.jpg$/,
        use: 'url-loader?limit=4096&mimetype=image/jpg',
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=4096&mimetype=image/png',
      },
      {
        test: /\.svg/,
        use: 'url-loader?limit=4096&mimetype=image/svg+xml',
      },
      {
        test: /\.(woff|woff2|ttf|eot)/,
        use: 'url-loader?limit=1',
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
      filename: OUTPUT_CSS,
      allChunks: true,
      disable: (!EXTRACT_CSS || NODE_ENV === 'dev'),
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
