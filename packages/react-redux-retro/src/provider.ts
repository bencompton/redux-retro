import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

export interface IProviderProps extends React.Props<any> {
    store: Store<any>;
    actions: any;
}

export default (props: IProviderProps) => {
  (props.store.dispatch as any).actions = props.actions;
  return React.createElement(Provider, { store: props.store, ...props });
};
