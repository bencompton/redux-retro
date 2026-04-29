import { ITodo, ITodoRepository } from './ITodoRepository';

const DB_NAME = 'todo-app';
const STORE_NAME = 'todos';

/**
 * Persists todos in the browser's IndexedDB. Used in the real (non-mock) entry
 * point. Not used in tests — substitute MockTodoRepository instead.
 */
export class IndexedDbTodoRepository implements ITodoRepository {
    private db: IDBDatabase | null = null;

    private openDb(): Promise<IDBDatabase> {
        if (this.db) {
            return Promise.resolve(this.db);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db!);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getAll(): Promise<ITodo[]> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const request = db.transaction(STORE_NAME, 'readonly')
                .objectStore(STORE_NAME)
                .getAll();

            request.onsuccess = () => resolve(request.result as ITodo[]);
            request.onerror = () => reject(request.error);
        });
    }

    async add(text: string): Promise<ITodo> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const partial = { text, completed: false };
            const request = db.transaction(STORE_NAME, 'readwrite')
                .objectStore(STORE_NAME)
                .add(partial);

            request.onsuccess = () => resolve({ ...partial, id: request.result as number });
            request.onerror = () => reject(request.error);
        });
    }

    async complete(id: number): Promise<void> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const todo = getRequest.result as ITodo;
                if (todo) {
                    todo.completed = true;
                    store.put(todo);
                }
                resolve();
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async remove(id: number): Promise<void> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const request = db.transaction(STORE_NAME, 'readwrite')
                .objectStore(STORE_NAME)
                .delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
