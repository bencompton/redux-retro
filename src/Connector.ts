import * as React from 'react';
import {Provider as ReduxProvider, connect as reduxConnect} from 'react-redux';

export const connect = (mapStateToProps: any, mapActionsToProps: any, component: any) => {
    var mapDispatchToProps = (dispatch: any) => {
        if (mapActionsToProps) {
            return mapActionsToProps(dispatch.actions);
        }

        return {};
    }

    return reduxConnect(mapStateToProps, mapDispatchToProps)(component);
}

export interface IProviderProps {
    store: Redux.Store<any>;
    actions: any;
}

class ExtendedProvider extends ReduxProvider {
    constructor(props: any, context: any) {
        super(props, context);
        (props.store.dispatch as any).actions = props.actions;
    }
}

class Connector extends React.Component<IProviderProps, any> { }

export const Provider = ExtendedProvider as typeof Connector;