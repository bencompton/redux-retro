import { connect } from 'react-redux-retro';
import { AddTodoForm } from '../components/AddTodoForm';
import { ITodoAppState } from '../actions/TodoActions';
import { ITodoAppActions } from '../actions/actions';

export const mapStateToProps = (_state: ITodoAppState) => ({});

export const mapActionsToProps = (actions: ITodoAppActions) => ({
    onAdd: (text: string) => actions.addTodo(text)
});

export const AddTodoFormContainer = connect(
    mapStateToProps,
    mapActionsToProps,
    AddTodoForm
);
