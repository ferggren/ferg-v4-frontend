'use strict';

export function setUserIp(user_ip) {
  return {
    type: 'USER_IP_SET',
    user_ip,
  };
}
