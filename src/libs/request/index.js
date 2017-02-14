'use strict';

import ServerRequest from './request.server.js';
import ClientRequest from './request.client.js';

/* global NODE_MODE */
const Request = NODE_MODE === 'server' ? ServerRequest : ClientRequest;
export default Request;
