'use strict';

import Request from 'libs/request';

/**
 *  Check if user browser have support of modern JS
 */
export function areScriptsEnabled(headers) {
  if (!headers['user-agent']) return true;

  const user_agent = headers['user-agent'];

  if (user_agent.match(/MSIE\s*\d+/i)) return false;
  if (user_agent.match(/Trident\/\s*\d+/i)) return false;
  if (user_agent.match(/Opera Mini\/\s*\d+/i)) return false;
  if (user_agent.match(/UCWEB\/\s*\d+/i)) return false;

  return true;
}

/**
 *  Get user ip
 */
export function getUserIp(headers) {
  if (!headers['x-real-ip']) return false;

  const user_ip = headers['x-real-ip'];
  const match = user_ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

  return match ? user_ip : false;
}

/**
 *  Get user session
 */
export function getUserSession(headers) {
  if (!headers.cookie) return false;

  const cookie = headers.cookie;
  const session = cookie.match(/__session_id=([^;:\s\n\r\t]+)/);

  return session ? session[1] : false;
}

/**
 *  Load user data
 */
export function loadUserData(user_session, user_ip) {
  const promise = [];

  if (!user_session) return promise;

  promise.push(
    new Promise((resolve, reject) => {
      Request.fetch(
        '/api/user/getInfo', {
          success: (user_info) => {
            resolve(user_info);
          },

          error: (error) => {
            reject(error);
          },

          method: 'GET',
          remote_ip: user_ip,
          session: user_session,
        }
      );
    })
  );

  return promise;
}
