import React from 'react';

export const GlobalContext = React.createContext<any>({});

export function GlobalContextProvider(props: any) {
  const state = React.useState({});
  return <GlobalContext.Provider {...props} value={state} />;
}
