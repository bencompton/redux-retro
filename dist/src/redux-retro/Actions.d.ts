import { Store } from 'redux';
export interface IAction<TPayload> {
    type: any;
    payload?: TPayload;
}
export declare abstract class Actions<TAppState> {
    private store;
    constructor(store: Store<TAppState>);
    getState(): TAppState;
    private convertMethodNameToActionType(methodName);
    private checkIfPromise(obj);
    private generateWrapperFunction(member);
    private reconfigureActions();
    protected dispatch(action: IAction<any>): void;
}
