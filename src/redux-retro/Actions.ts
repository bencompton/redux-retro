import { Store, Action } from 'redux';

export interface IAction<TPayload> {
    type: any;
    payload: TPayload;
}

export abstract class Actions<TAppState> {
    private store: Store<TAppState>;

    constructor(store: Store<TAppState>) {
        this.store = store;
        this.reconfigureActions();
    }

    public getState(): TAppState {
        return this.store.getState();
    }

    private convertMethodNameToActionType(methodName: string): string {
        return methodName.replace(/[a-z]([A-Z])/g, (i) => {
            return `${i[0]}_${i[1].toLowerCase()}`}).toUpperCase();
    }

    private checkIfPromise(obj: any): boolean {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    private generateWrapperFunction(member: any) {
        return (...args: any[]) => {
            var payload = member.apply(this, args);

            if (payload !== undefined && !this.checkIfPromise(payload)) {
                this.dispatch({
                    type: member.actionType,
                    payload: payload
                });
            }

            return payload;
        }        
    }

    private reconfigureActions() {
        var prototype = this.constructor.prototype;

        for (let i in prototype) {
            var member = prototype[i];

            if (typeof member == 'function' && prototype.hasOwnProperty(i)) {
                let actionType = this.convertMethodNameToActionType(i);

                member.actionType = actionType;

                (this as any)[i] = this.generateWrapperFunction(member);
            }
        }
    }

    protected dispatch(action: Action | IAction<any>) {
        this.store.dispatch(action);
    }
}