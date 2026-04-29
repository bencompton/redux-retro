import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createAppStore } from './store/createAppStore';
import { getActions } from './actions/actions';
import { IndexedDbTodoRepository } from './repositories/todo/IndexedDbTodoRepository';
import { App } from './components/App';

const repository = new IndexedDbTodoRepository();
const store = createAppStore();
const actions = getActions(store, repository);

actions.loadTodos();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(App, { store, actions }));
