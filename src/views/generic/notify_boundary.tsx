import React, { useContext, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { If } from 'react-extras';
import { Snackbar, SnackbarAction } from 'rmwc';

import { GlobalContext } from 'utils/state';

export function NotifyBoundary(props: any) {
  const [, setState] = useContext(GlobalContext);
  const [error, setError] = useState<Error | undefined>(undefined);

  useDeepCompareEffect(() => {
    window.addEventListener('notify', (e: CustomEventInit) => {
      setError(e.detail);
      setState({});
    });
  }, [{}]);

  return (
    <>
      <If condition={!!error}>
        <Snackbar
          open
          message={error?.message}
          dismissesOnAction
          timeout={5000}
          action={<SnackbarAction label="Selvä" />}
          onClose={() => setError(undefined)}
        />
      </If>
      {props.children}
    </>
  );
}
