import { createStore, Store } from 'redux';
import { todoReducer } from '../reducers/todoReducer';
import { ITodoAppState } from '../actions/TodoActions';

export function createAppStore(): Store<ITodoAppState> {
    return createStore(todoReducer);
}
