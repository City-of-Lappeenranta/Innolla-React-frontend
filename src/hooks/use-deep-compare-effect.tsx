import React, { useRef, useEffect } from 'react';
import _ from 'lodash';

function deepCompareEquals(a: any, b: any) {
  return _.isEqual(a, b);
}

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

export function useDeepCompareEffect(
  callback: React.EffectCallback,
  dependencies: Array<any>
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
