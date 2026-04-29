import { Actions } from 'redux-retro';
import { Store } from 'redux';
import { ITodo, ITodoRepository } from '../repositories/todo/ITodoRepository';

export { ITodo } from '../repositories/todo/ITodoRepository';

export interface ITodoAppState {
    todos: ITodo[];
}

/**
 * TodoActions demonstrates how constructor-injected dependencies work in Redux
 * Retro. The ITodoRepository is passed in at construction time, making it
 * trivial to substitute a MockTodoRepository in tests without any mocking
 * framework or module interception.
 *
 * Async methods drive side-effectful workflows. They do not dispatch anything
 * themselves — instead they call the synchronous *Succeeded methods, which
 * return payloads and are auto-dispatched by Redux Retro.
 */
export class TodoActions extends Actions<ITodoAppState> {
    private repository: ITodoRepository;

    constructor(store: Store<ITodoAppState>, repository: ITodoRepository) {
        super(store);
        this.repository = repository;
    }

    // ── async workflow methods ────────────────────────────────────────────────

    async loadTodos() {
        const todos = await this.repository.getAll();
        this.loadTodosSucceeded(todos);
    }

    async addTodo(text: string) {
        const todo = await this.repository.add(text);
        this.addTodoSucceeded(todo);
    }

    async completeTodo(id: number) {
        await this.repository.complete(id);
        this.completeTodoSucceeded(id);
    }

    async removeTodo(id: number) {
        await this.repository.remove(id);
        this.removeTodoSucceeded(id);
    }

    // ── synchronous dispatch methods (bound in the reducer) ──────────────────

    loadTodosSucceeded(todos: ITodo[]) {
        return todos;
    }

    addTodoSucceeded(todo: ITodo) {
        return todo;
    }

    completeTodoSucceeded(id: number) {
        return id;
    }

    removeTodoSucceeded(id: number) {
        return id;
    }
}
