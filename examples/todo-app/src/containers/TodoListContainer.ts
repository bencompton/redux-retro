import { connect } from 'react-redux-retro';
import { TodoList } from '../components/TodoList';
import { ITodoAppState } from '../actions/TodoActions';
import { ITodoAppActions } from '../actions/actions';

export const mapStateToProps = (state: ITodoAppState) => ({
    todos: state.todos
});

export const mapActionsToProps = (actions: ITodoAppActions) => ({
    onComplete: (id: number) => actions.completeTodo(id),
    onRemove: (id: number) => actions.removeTodo(id)
});

export const TodoListContainer = connect(
    mapStateToProps,
    mapActionsToProps,
    TodoList
);
