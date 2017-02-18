'use strict';

/* global NODE_MODE */
/* eslint-disable global-require */

if (NODE_MODE === 'server') {
  module.exports = require('./request.server.js');
} else {
  module.exports = require('./request.client.js');
}
