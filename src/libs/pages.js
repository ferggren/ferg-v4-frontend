'use strict';

export function getPagesType(location) {
  const match = location.match(/^\/(?:en\/|ru\/)?(?:admin\/)?(blog|travel)\//);

  if (!match) return 'blog';
  return match[1];
}
