import { Store } from 'redux';
import { ITodoAppState, TodoActions } from './TodoActions';
import { ITodoRepository } from '../repositories/todo/ITodoRepository';

export interface ITodoAppActions {
    loadTodos(): Promise<void>;
    addTodo(text: string): Promise<void>;
    completeTodo(id: number): Promise<void>;
    removeTodo(id: number): Promise<void>;
}

export function getActions(store: Store<ITodoAppState>, repository: ITodoRepository): ITodoAppActions {
    return new TodoActions(store, repository);
}
