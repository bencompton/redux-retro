import * as React from 'react';
import { ITodo } from '../repositories/todo/ITodoRepository';

export interface ITodoItemProps {
    todo: ITodo;
    onComplete: (id: number) => void;
    onRemove: (id: number) => void;
}

export const TodoItem = ({ todo, onComplete, onRemove }: ITodoItemProps) => (
    <li style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        <span>{todo.text}</span>
        {!todo.completed && (
            <button onClick={() => onComplete(todo.id)}>Complete</button>
        )}
        <button onClick={() => onRemove(todo.id)}>Remove</button>
    </li>
);
