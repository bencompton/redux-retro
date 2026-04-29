import { createAppStore } from './store/createAppStore';
import { getActions } from './actions/actions';
import { IndexedDbTodoRepository } from './repositories/todo/IndexedDbTodoRepository';

const repository = new IndexedDbTodoRepository();
const store = createAppStore();
const actions = getActions(store, repository);

actions.loadTodos();

export { store, actions };
