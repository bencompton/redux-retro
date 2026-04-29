import { createAppStore } from './store/createAppStore';
import { getActions } from './actions/actions';
import { MockTodoRepository } from './repositories/todo/MockTodoRepository';

const repository = new MockTodoRepository();
const store = createAppStore();
const actions = getActions(store, repository);

// Seed a couple of todos so the mock UI starts with something to interact with.
repository.add('Buy groceries');
repository.add('Walk the dog');
actions.loadTodos();

export { store, actions };
