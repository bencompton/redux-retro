import { createReducer } from 'redux-retro';
import { TodoActions, ITodoAppState } from '../actions/TodoActions';

export const initialState: ITodoAppState = {
    todos: []
};

export const todoReducer = createReducer<ITodoAppState>(initialState)
    .bindAction(TodoActions.prototype.loadTodosSucceeded, (state, action) => {
        state.todos = action.payload;
    })
    .bindAction(TodoActions.prototype.addTodoSucceeded, (state, action) => {
        state.todos.push(action.payload);
    })
    .bindAction(TodoActions.prototype.completeTodoSucceeded, (state, action) => {
        const todo = state.todos.find(t => t.id === action.payload);
        if (todo) {
            todo.completed = true;
        }
    })
    .bindAction(TodoActions.prototype.removeTodoSucceeded, (state, action) => {
        const index = state.todos.findIndex(t => t.id === action.payload);
        if (index !== -1) {
            state.todos.splice(index, 1);
        }
    });
