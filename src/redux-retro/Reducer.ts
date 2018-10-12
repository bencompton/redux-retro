import { Reducer } from 'redux';

import { IAction } from './Actions';

export interface IActionReducer<TState, TActionPayload> {
    (state: TState, action: IAction<TActionPayload>): TState;
}

export interface IReduxRetroReducer<TState> extends Reducer<TState> {
    bindAction: <TNextActionPayload>(action: (...args: any[]) => TNextActionPayload, reducer: IActionReducer<TState, TNextActionPayload>) => IReduxRetroReducer<TState>;
}

export interface IPayloadCreator<TPayload> {
    (...args: any[]): TPayload;
    actionType?: string;
}

export interface IBoundAction<TActionPayload, TState> {
    payloadCreatorMethod: IPayloadCreator<TActionPayload>;
    reducerFunction: IActionReducer<TState, TActionPayload>;
}

export interface IReducerWrapper<TState> {
    reducer: IReduxRetroReducer<TState>;
}

export const reducer = {
    generateActionBinder<TState>(boundActions: IBoundAction<any, TState>[], mainReducer: IActionReducer<TState, any>) {
        return {
            bindAction<TNextActionPayload>(
                action: IPayloadCreator<TNextActionPayload>,
                actionReducer: IActionReducer<TState, TNextActionPayload>
            ): IActionReducer<TState, TNextActionPayload> {
                boundActions.push({
                    payloadCreatorMethod: action,
                    reducerFunction: actionReducer
                });

                return mainReducer;
            }
        };
    },

    generateReducer<TState>(boundActions: IBoundAction<any, TState>[], initialState: TState) {
        var reducerFunction = (state: TState, action: IAction<any>): TState => {
            state = state || initialState;

            for (let i = 0; i < boundActions.length; i++) {
                let boundAction = boundActions[i];

                if (boundAction.payloadCreatorMethod.actionType === action.type) {
                    return boundAction.reducerFunction(state, action);
                }
            }

            return state;
        };

        (reducerFunction as any).bindAction = reducer.generateActionBinder<TState>(boundActions, reducerFunction).bindAction;

        return reducerFunction as IReduxRetroReducer<TState>;    
    },

    createReducer<TState>(initialState: TState): IReduxRetroReducer<TState> {
        var boundActions: IBoundAction<any, TState>[] = [];
        return reducer.generateReducer<TState>(boundActions, initialState);
    }
}

export const createReducer = reducer.createReducer;