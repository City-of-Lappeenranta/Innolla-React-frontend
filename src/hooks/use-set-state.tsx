import { useState } from 'react';

export function useSetState(): Function {
  const [, setState] = useState({});

  function changeState(callback: Function = () => {}) {
    callback();
    setState({});
  }

  return changeState;
}
