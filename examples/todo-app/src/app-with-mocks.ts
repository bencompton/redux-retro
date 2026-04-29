import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createAppStore } from './store/createAppStore';
import { getActions } from './actions/actions';
import { MockTodoRepository } from './repositories/todo/MockTodoRepository';
import { App } from './components/App';

const repository = new MockTodoRepository();
const store = createAppStore();
const actions = getActions(store, repository);

// Seed a couple of todos so the mock UI starts with something to interact with.
repository.add('Buy groceries');
repository.add('Walk the dog');
actions.loadTodos();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(App, { store, actions }));
