import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

export interface IProviderProps extends React.PropsWithChildren<{}> {
    store: Store<any>;
    actions: any;
}

export default ({ children, store, actions }: IProviderProps) => {
  (store.dispatch as any).actions = actions;
  return React.createElement(Provider, { store, children });
};
