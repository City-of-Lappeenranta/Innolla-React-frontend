import { useContext, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { If } from 'react-extras';
import { Snackbar, SnackbarAction } from 'rmwc';

import { GlobalContext } from 'utils/state';
import { User } from 'models';

export function ErrorBoundary(props: any) {
  const [, setState] = useContext(GlobalContext);
  const [error, setError] = useState<Error | undefined>(undefined);

  useDeepCompareEffect(() => {
    window.addEventListener('error', (e: CustomEventInit) => {
      setError(undefined);
      const error = e.detail as Error;
      switch (error?.message) {
        case 'Not logged in':
          setError({ ...e.detail, message: 'Olet kirjautunut ulos.' });
          break;
        case 'Signature has expired':
          User.current.token = null;
          setError({ ...e.detail, message: 'Olet kirjautunut ulos.' });
          setState({});
          break;
        case 'Error decoding signature':
          User.current.token = null;
          setError({ ...e.detail, message: 'Olet kirjautunut ulos.' });
          setState({});
          break;
        case 'Please enter valid credentials':
          setError({
            ...e.detail,
            message: 'Käyttäjätunnus ja salasana ei täsmää.',
          });
          break;
        default:
          setError({ ...e.detail, message: 'Jotain odottamatonta tapahtui.' });
          throw e.detail;
      }
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
