import * as React from 'react';
import { Provider } from 'react-redux-retro';
import { Store } from 'redux';
import { ITodoAppState } from '../actions/TodoActions';
import { ITodoAppActions } from '../actions/actions';
import { AddTodoFormContainer } from '../containers/AddTodoFormContainer';
import { TodoListContainer } from '../containers/TodoListContainer';

export interface IAppProps {
    store: Store<ITodoAppState>;
    actions: ITodoAppActions;
}

export const App = ({ store, actions }: IAppProps) => (
    <Provider store={store} actions={actions}>
        <div>
            <h1>Todo App</h1>
            <AddTodoFormContainer />
            <TodoListContainer />
        </div>
    </Provider>
);

