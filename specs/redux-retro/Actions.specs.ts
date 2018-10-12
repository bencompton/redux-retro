import {Store} from 'redux';

import {Actions} from '../../src/redux-retro//Actions';

describe('Actions', () => {
    let mockStore: Store<string>;

    beforeEach(() => {
        mockStore = ({
            dispatch: jasmine.createSpy('dispatch')
        } as any);
    });

    describe('Calling action methods', () => {
        describe('When an action method returns a payload that is not undefined or a promise', () => {
            const actionPayload = 'action payload';

            class PlainActions extends Actions<string> {
                someAction() {
                    return actionPayload;
                }
            }

            beforeEach(() => {
                let testActions = new PlainActions(mockStore);
                testActions.someAction();
            });

            it('should dispatch the action through the store', () => {
                expect((mockStore.dispatch as jasmine.Spy).calls.count()).toBe(1);
            });

            it('should dispatch with an action type string that is an uppercase version of the method name', () => {
                expect((mockStore.dispatch as jasmine.Spy).calls.first().args[0].type).toBe('SOME_ACTION');
            });

            it('should dispatch with a payload that is what the method returned', () => {
                expect((mockStore.dispatch as jasmine.Spy).calls.first().args[0].payload).toBe(actionPayload);                
            });
        });
        
        describe('When an action returns a promise', () => {
            class PromiseActions extends Actions<string> {
                actionWithPromise() {
                    return Promise.resolve();
                }
            }

            beforeEach(() => {
                let promiseActions = new PromiseActions(mockStore);
                promiseActions.actionWithPromise();
            });

            it('should not dispatch an action through the store', () => {
                expect((mockStore.dispatch as jasmine.Spy)).not.toHaveBeenCalled();
            });
        });

        describe('When an action returns nothing (undefined)', () => {
            class ActionsReturningNothing extends Actions<string> {
                returnNothing() {
                    //Call some other actions or whatever
                }
            }

            beforeEach(() => {
                let actionsReturningNothing = new ActionsReturningNothing(mockStore);
                actionsReturningNothing.returnNothing();
            });

            it('should not dispatch an action through the store', () => {
                expect((mockStore.dispatch as jasmine.Spy)).not.toHaveBeenCalled();
            });
        });
    });

    describe('Manually dispatching an action', () => {
        let actionType = 'MANUAL';
        let payload = 'payload';

        class ManualDispatch extends Actions<string> {
            manualDispatch() {
                this.dispatch({
                    type: actionType,
                    payload: payload
                });
            }
        }

        beforeEach(() => {
            let manualDispatch = new ManualDispatch(mockStore);
            manualDispatch.manualDispatch();
        });

        it('should dispatch the action through the store', () => {
            expect((mockStore.dispatch as jasmine.Spy).calls.count()).toBe(1);
            expect((mockStore.dispatch as jasmine.Spy).calls.first().args[0].type).toBe(actionType);
            expect((mockStore.dispatch as jasmine.Spy).calls.first().args[0].payload).toBe(payload);
        });
    });
});