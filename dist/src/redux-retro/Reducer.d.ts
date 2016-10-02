import { IAction } from './Actions';
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
export declare const reducer: {
    generateActionBinder<TState>(boundActions: IBoundAction<any, TState>[], mainReducer: IReducer<TState, any>): {
        bindAction<TNextActionPayload>(action: IPayloadCreator<TNextActionPayload>, actionReducer: IReducer<TState, TNextActionPayload>): IReducer<TState, TNextActionPayload>;
    };
    generateReducerFunction<TState>(boundActions: IBoundAction<any, TState>[], initialState: TState): IReducer<TState, any>;
    createReducer<TState>(initialState: TState): IReducer<TState, any>;
};
export declare const createReducer: <TState>(initialState: TState) => IReducer<TState, any>;
