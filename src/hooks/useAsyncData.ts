import { useEffect, useState } from 'react';

import type { DataResult } from '@/services/sharepathData';

type AsyncDataState<T> = {
  data: T;
  isFallback: boolean;
  isLoading: boolean;
};

export function useAsyncData<T>(loader: () => Promise<DataResult<T>>, initialData: T, dependencies: unknown[] = []) {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: initialData,
    isFallback: true,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    loader()
      .then((result) => {
        if (isMounted) {
          setState({ data: result.data, isFallback: result.isFallback, isLoading: false });
        }
      })
      .catch((error: unknown) => {
        if (__DEV__) {
          console.warn('Unable to load data. Showing sample data for now.', error);
        }

        if (isMounted) {
          setState({ data: initialData, isFallback: true, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
    // The caller controls when this data reloads through the dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return state;
}
