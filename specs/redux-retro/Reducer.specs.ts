import { createReducer, IReduxRetroReducer } from '../../src/redux-retro/Reducer';
import { Actions } from '../../src/redux-retro/Actions';
import { Store } from 'redux';

describe('Reducers', () => {
    let reducer: IReduxRetroReducer<string>;
    let initialState = 'initial state';

    class TestActions extends Actions<string> {
        a() {
            return 'A';
        }

        b() {
            return 'B';
        }
    }

    let testActions: TestActions;

    beforeEach(() => {
        testActions = new TestActions({} as Store<any>);
        reducer = createReducer<string>(initialState);
    });

    describe('Initial state', () => {
        describe('When a reducer is called with no state passed in', () => {
            let newState: string;

            beforeEach(() => {
                newState = reducer(undefined, {
                    type: '@test',
                    payload: null
                });
            });

            it('should return the reducer\'s initial state', () => {
                expect(newState).toBe(initialState);
            });
        });
    });

    describe('Handling dispatched actions', () => {
        describe('When the reducer is called with an action type bound to it', () => {
            let expectedState = 'state that the bound action returns';
            let newState: string; 

            beforeEach(() => {
                reducer.bindAction(TestActions.prototype.a, (state, action) => {
                    return expectedState;
                });

                newState = reducer(initialState, {
                    type: 'A',
                    payload: null
                });
            });

            it('should return the state that the bound function returns', () => {
                expect(newState).toBe(expectedState);
            });
        });

        describe('When the reducer is called with an action type not bound to it', () => {
            let otherActionState = 'other action state';
            let passedInState = 'passedInState';
            let newState: string;

            beforeEach(() => {
                reducer.bindAction(TestActions.prototype.a, (state, action) => {
                        return otherActionState;
                    });

                newState = reducer(passedInState, {
                    type: 'B',
                    payload: null
                });
            });
            
            it('should return the state passed to it', () => {
                expect(newState).toBe(passedInState);
            });
        });

        describe('When a reducer is bound to action types A and B, and action type A is dispatched', () => {
            let reducerFunctionForActionA = jasmine.createSpy('reducerFunctionForActionA');
            let reducerFunctionForActionB = jasmine.createSpy('reducerFunctionForActionB');

            beforeEach(() => {
                reducer
                    .bindAction(TestActions.prototype.a, reducerFunctionForActionA)
                    .bindAction(TestActions.prototype.b, reducerFunctionForActionB);

                reducer(initialState, {
                    type: 'A',
                    payload: null
                });
            });            

            it('should call the bound reducer function for action A', () => {
                expect(reducerFunctionForActionA).toHaveBeenCalled();
            });

            it('should NOT call the bound reducer function for action B', () => {
                expect(reducerFunctionForActionB).not.toHaveBeenCalled();
            });
        });
    });
});