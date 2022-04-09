import { cancelable } from 'cancelable-promise';
import React, { useEffect } from 'react';

export function usePromise(
  promise: () => Promise<void>,
  deps?: React.DependencyList
) {
  return useEffect(() => {
    const { cancel } = cancelable(promise());
    return cancel;
  }, deps);
}

export default usePromise;
