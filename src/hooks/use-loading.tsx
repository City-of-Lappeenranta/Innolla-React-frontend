import { useMemo, useState } from 'react';

import { useAsyncEffect } from 'use-async-effect';

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useLoading(...loadings: Array<boolean>): boolean {
  const [initialLoading, setInitialLoading] = useState(loadings[0] ?? true);

  useAsyncEffect(
    async (isMounted) => {
      if (!initialLoading) return;
      await timeout(500);
      if (!isMounted()) return;
      setInitialLoading(false);
    },
    [loadings]
  );

  const isLoading = useMemo(() => {
    const isLoading = loadings.includes(true);
    return initialLoading ? initialLoading || isLoading : false;
  }, [initialLoading, loadings]);

  return isLoading;
}
