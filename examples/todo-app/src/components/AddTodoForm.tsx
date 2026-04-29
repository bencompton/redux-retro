import * as React from 'react';

export interface IAddTodoFormProps {
    onAdd: (text: string) => void;
}

export const AddTodoForm = ({ onAdd }: IAddTodoFormProps) => {
    const [text, setText] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What needs to be done?"
            />
            <button type="submit">Add</button>
        </form>
    );
};
