import {IAction} from './Actions';

export interface IReducer<TState, TActionPayload> {
    (state: TState, action: IAction<TActionPayload>): TState;
    bindAction?: <TNextActionPayload>(action: (...args: Object[]) => TNextActionPayload, reducer: IReducer<TState, TNextActionPayload>) => IReducer<TState, any>;
}

export interface IPayloadCreator<TPayload> {
    (...args: Object[]): TPayload;
    actionType?: string;
}

export interface IBoundAction<TActionPayload, TState> {
    payloadCreatorMethod: IPayloadCreator<TActionPayload>;
    reducerFunction: IReducer<TState, TActionPayload>;
}

export interface IReducerWrapper<TState> {
    reducer: IReducer<TState, any>;
}

export const reducer = {
    generateActionBinder<TState>(boundActions: IBoundAction<any, TState>[], mainReducer: IReducer<TState, any>) {
        return {
            bindAction<TNextActionPayload>(action: IPayloadCreator<TNextActionPayload>, actionReducer: IReducer<TState, TNextActionPayload>): IReducer<TState, TNextActionPayload> {
                boundActions.push({
                    payloadCreatorMethod: action,
                    reducerFunction: actionReducer
                });

                return mainReducer;
            }
        };
    },

    generateReducerFunction<TState>(boundActions: IBoundAction<any, TState>[], initialState: TState) {
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

        return reducerFunction as IReducer<TState, any>;    
    },

    createReducer<TState>(initialState: TState): IReducer<TState, any> {
        var boundActions: IBoundAction<any, TState>[] = [];
        return reducer.generateReducerFunction<TState>(boundActions, initialState);
    }
}

export const createReducer = reducer.createReducer;