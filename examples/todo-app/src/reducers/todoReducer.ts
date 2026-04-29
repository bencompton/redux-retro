import { createReducer } from 'redux-retro';
import { TodoActions, ITodoAppState } from '../actions/TodoActions';

export const initialState: ITodoAppState = {
    todos: []
};

export const todoReducer = createReducer<ITodoAppState>(initialState)
    .bindAction(TodoActions.prototype.loadTodosSucceeded, (draft, action) => {
        draft.todos = action.payload;
    })
    .bindAction(TodoActions.prototype.addTodoSucceeded, (draft, action) => {
        draft.todos.push(action.payload);
    })
    .bindAction(TodoActions.prototype.completeTodoSucceeded, (draft, action) => {
        const todo = draft.todos.find(t => t.id === action.payload);
        if (todo) {
            todo.completed = true;
        }
    })
    .bindAction(TodoActions.prototype.removeTodoSucceeded, (draft, action) => {
        const index = draft.todos.findIndex(t => t.id === action.payload);
        if (index !== -1) {
            draft.todos.splice(index, 1);
        }
    });
