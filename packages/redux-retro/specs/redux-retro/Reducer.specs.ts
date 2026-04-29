import { createReducer, IReduxRetroReducer } from '../../src/redux-retro/Reducer';
import { Actions } from '../../src/redux-retro/Actions';
import { Store } from 'redux';

interface ITodo {
    id: number;
    text: string;
    completed: boolean;
}

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
            let reducerFunctionForActionA = jest.fn();
            let reducerFunctionForActionB = jest.fn();

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

    describe('Immer integration', () => {
        describe('Mutation-style reducers (immer draft)', () => {
            class TodoActions extends Actions<ITodo[]> {
                addTodo(todo: ITodo) {
                    return todo;
                }

                completeTodo(id: number) {
                    return id;
                }

                removeTodo(id: number) {
                    return id;
                }
            }

            let todoActions: TodoActions;
            let todoReducer: IReduxRetroReducer<ITodo[]>;
            const initialTodos: ITodo[] = [];

            beforeEach(() => {
                todoActions = new TodoActions({} as Store<any>);
                todoReducer = createReducer<ITodo[]>(initialTodos)
                    .bindAction(TodoActions.prototype.addTodo, (draft, action) => {
                        // Immer mutation style: push directly onto draft
                        draft.push(action.payload);
                    })
                    .bindAction(TodoActions.prototype.completeTodo, (draft, action) => {
                        const todo = draft.find(t => t.id === action.payload);
                        if (todo) {
                            todo.completed = true;
                        }
                    })
                    .bindAction(TodoActions.prototype.removeTodo, (draft, action) => {
                        const index = draft.findIndex(t => t.id === action.payload);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
            });

            describe('When a todo is added via mutation', () => {
                let newState: ITodo[];

                beforeEach(() => {
                    newState = todoReducer([], {
                        type: 'ADD_TODO',
                        payload: { id: 1, text: 'Write tests', completed: false }
                    });
                });

                it('should contain the new todo', () => {
                    expect(newState).toHaveLength(1);
                    expect(newState[0]).toEqual({ id: 1, text: 'Write tests', completed: false });
                });

                it('should not mutate the original state', () => {
                    expect(initialTodos).toHaveLength(0);
                });
            });

            describe('When a todo is completed via mutation', () => {
                let prevState: ITodo[];
                let newState: ITodo[];

                beforeEach(() => {
                    prevState = [
                        { id: 1, text: 'Write tests', completed: false },
                        { id: 2, text: 'Ship it', completed: false }
                    ];

                    newState = todoReducer(prevState, {
                        type: 'COMPLETE_TODO',
                        payload: 1
                    });
                });

                it('should mark the correct todo as completed', () => {
                    expect(newState[0].completed).toBe(true);
                    expect(newState[1].completed).toBe(false);
                });

                it('should not mutate the original state', () => {
                    expect(prevState[0].completed).toBe(false);
                });
            });

            describe('When a todo is removed via mutation', () => {
                let prevState: ITodo[];
                let newState: ITodo[];

                beforeEach(() => {
                    prevState = [
                        { id: 1, text: 'Write tests', completed: false },
                        { id: 2, text: 'Ship it', completed: false }
                    ];

                    newState = todoReducer(prevState, {
                        type: 'REMOVE_TODO',
                        payload: 1
                    });
                });

                it('should remove the correct todo', () => {
                    expect(newState).toHaveLength(1);
                    expect(newState[0].id).toBe(2);
                });

                it('should not mutate the original state', () => {
                    expect(prevState).toHaveLength(2);
                });
            });
        });

        describe('Return-value-style reducers still work with immer', () => {
            class CounterActions extends Actions<number> {
                increment(amount: number) {
                    return amount;
                }
            }

            let counterActions: CounterActions;
            let counterReducer: IReduxRetroReducer<number>;

            beforeEach(() => {
                counterActions = new CounterActions({} as Store<any>);
                counterReducer = createReducer<number>(0)
                    .bindAction(CounterActions.prototype.increment, (state, action) => {
                        // Return-value style: return new state explicitly
                        return (state as unknown as number) + action.payload;
                    });
            });

            describe('When the counter is incremented', () => {
                let newState: number;

                beforeEach(() => {
                    newState = counterReducer(5, {
                        type: 'INCREMENT',
                        payload: 3
                    });
                });

                it('should return the incremented value', () => {
                    expect(newState).toBe(8);
                });
            });
        });
    });
});