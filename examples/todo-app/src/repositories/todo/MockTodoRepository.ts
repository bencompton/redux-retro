import { ITodo, ITodoRepository } from './ITodoRepository';

/**
 * In-memory repository used in tests and the mock entry point. No browser APIs
 * required, so it runs equally well in Node.js (Jest) and the browser.
 */
export class MockTodoRepository implements ITodoRepository {
    private todos: ITodo[] = [];
    private nextId = 1;

    async getAll(): Promise<ITodo[]> {
        return [...this.todos];
    }

    async add(text: string): Promise<ITodo> {
        const todo: ITodo = { id: this.nextId++, text, completed: false };
        this.todos.push(todo);
        return todo;
    }

    async complete(id: number): Promise<void> {
        this.todos = this.todos.map(t => t.id === id ? { ...t, completed: true } : t);
    }

    async remove(id: number): Promise<void> {
        this.todos = this.todos.filter(t => t.id !== id);
    }
}
