import {expect} from 'chai';

import {createReducer, IReducer} from '../../src/redux-retro/Reducer';
import {Actions} from '../../src/redux-retro/Actions';

describe('Reducers', () => {
    let reducer: IReducer<string, any>;
    let initialState = 'initial state';

    class TestActions extends Actions<string> {
        A() {
            return 'A';
        }

        B() {
            return 'B';
        }
    }

    beforeEach(() => {
        reducer = createReducer<string>(initialState);
    });

    describe('Initial state', () => {
        describe('When a reducer is called with no state passed in', () => {
            let newState: string;

            beforeEach(() => {
                reducer(null, {
                    type: '@test',
                    payload: null
                })
            });

            it('should return the reducer\'s initial state', () => {
                expect(newState).to.equal(initialState);
            });
        });
    });

    describe('Handling dispatched actions', () => {
        describe('When the reducer is called with an action type bound to it', () => {
            let expectedState = 'state that the bound action returns';
            let newState: string; 

            beforeEach(() => {
                reducer.bindAction(TestActions.prototype.A, (state, action) => {
                    return expectedState;
                });

                newState = reducer(initialState, {
                    type: 'A',
                    payload: null
                });
            });

            it('should return the state that the bound function returns', () => {
                expect(newState).to.equal(expectedState);
            });
        });

        describe('When the reducer is called with an action type not bound to it', () => {
            let expectedState = 'state that the bound action returns';
            let newState: string; 

            beforeEach(() => {
                reducer.bindAction(TestActions.prototype.A, (state, action) => {
                    return expectedState;
                });

                newState = reducer(initialState, {
                    type: 'B',
                    payload: null
                });
            });
            
            xit('should return the state passed to it', () => {
                expect(newState).to.equal(initialState);
            });
        })

        describe('When a reducer is bound to action types A and B, and action type A is dispatched', () => {
            let reducerFunctionForActionA = sinon.spy();
            let reducerFunctionForActionB = sinon.spy();

            beforeEach(() => {
                reducer
                    .bindAction(TestActions.prototype.A, reducerFunctionForActionA)
                    .bindAction(TestActions.prototype.B, reducerFunctionForActionB);

                reducer(initialState, {
                    type: 'A',
                    payload: null
                });
            });            

            it('should call the bound reducer function for action A', () => {
                expect(reducerFunctionForActionA.called).to.equal(true);
            });

            it('should NOT call the bound reducer function for action B', () => {
                expect(reducerFunctionForActionB.called).to.equal(false);
            });
        });
    });
});