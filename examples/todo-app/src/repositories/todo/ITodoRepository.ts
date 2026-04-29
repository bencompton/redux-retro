export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
}

/**
 * Abstraction over the persistence layer for todos. Accepting this interface
 * as a constructor dependency on TodoActions allows tests to substitute a
 * lightweight in-memory implementation without any mocking framework.
 */
export interface ITodoRepository {
    getAll(): Promise<ITodo[]>;
    add(text: string): Promise<ITodo>;
    complete(id: number): Promise<void>;
    remove(id: number): Promise<void>;
}
