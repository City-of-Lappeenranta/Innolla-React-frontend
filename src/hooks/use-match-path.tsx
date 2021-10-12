import { matchPath, useLocation } from 'react-router-dom';
export { useAsyncEffect } from 'use-async-effect';

export function useMatchPath() {
  const location = useLocation();
  const match = (pathname: string) =>
    matchPath(location.pathname, {
      path: pathname,
      exact: false,
      strict: false,
    });
  return match;
}
