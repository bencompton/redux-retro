import * as React from 'react';
import { ITodo } from '../repositories/todo/ITodoRepository';
import { TodoItem } from './TodoItem';

export interface ITodoListProps {
    todos: ITodo[];
    onComplete: (id: number) => void;
    onRemove: (id: number) => void;
}

export const TodoList = ({ todos, onComplete, onRemove }: ITodoListProps) => (
    <ul>
        {todos.length === 0 && <li><em>No todos yet. Add one above!</em></li>}
        {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onComplete={onComplete} onRemove={onRemove} />
        ))}
    </ul>
);
