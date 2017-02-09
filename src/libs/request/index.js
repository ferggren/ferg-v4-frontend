'use strict';

import ServerRequest from './request.server.js';
import ClientRequest from './request.client.js';

/* global SCRIPT_ENV */
const Request = SCRIPT_ENV === 'server' ? ServerRequest : ClientRequest;
export default Request;
