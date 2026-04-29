import { createAppStore } from '../src/store/createAppStore';
import { getActions, ITodoAppActions } from '../src/actions/actions';
import { MockTodoRepository } from '../src/repositories/todo/MockTodoRepository';
import { ITodoAppState } from '../src/actions/TodoActions';
import { mapStateToProps as todoListState, mapActionsToProps as todoListActions } from '../src/containers/TodoListContainer';
import { mapActionsToProps as addTodoActions } from '../src/containers/AddTodoFormContainer';
import { Store } from 'redux';

describe('Todo App', () => {
    let repository: MockTodoRepository;
    let store: Store<ITodoAppState>;
    let actions: ITodoAppActions;

    // Container-derived helpers — the same API surface the UI components use
    const getTodos = () => todoListState(store.getState()).todos;
    const addTodo = (text: string) => addTodoActions(actions).onAdd(text);
    const completeTodo = (id: number) => todoListActions(actions).onComplete(id);
    const removeTodo = (id: number) => todoListActions(actions).onRemove(id);

    beforeEach(() => {
        repository = new MockTodoRepository();
        store = createAppStore();
        actions = getActions(store, repository);
    });

    describe('When the app starts', () => {
        describe('when there are no todos saved from a previous session', () => {
            it('no todos should be shown', () => {
                expect(getTodos()).toHaveLength(0);
            })
        });

        describe('when there are todos saved from a previous session', () => {
            it('the saved todos should be shown', async () => {
                await repository.add('Buy groceries');
                await repository.add('Walk the dog');

                await actions.loadTodos();

                expect(getTodos()).toHaveLength(2);
                expect(getTodos()[0].text).toBe('Buy groceries');
                expect(getTodos()[1].text).toBe('Walk the dog');
            });
        });
    });

    describe('When a todo is added', () => {
        it('the new todo should be shown in the list', async () => {
            await addTodo('Write tests');

            expect(getTodos()).toHaveLength(1);
            expect(getTodos()[0].text).toBe('Write tests');
        });

        it('the new todo should not be completed', async () => {
            await addTodo('Write tests');

            expect(getTodos()[0].completed).toBe(false);
        });

        it('the new todo should be saved so it survives a page reload', async () => {
            await addTodo('Write tests');

            expect(await repository.getAll()).toHaveLength(1);
            expect((await repository.getAll())[0].text).toBe('Write tests');
        });
    });

    describe('When a todo is completed', () => {
        it('the todo should be shown as completed', async () => {
            await addTodo('Write tests');

            await completeTodo(getTodos()[0].id);

            expect(getTodos()[0].completed).toBe(true);
        });

        it('other todos should remain incomplete', async () => {
            await addTodo('Write tests');
            await addTodo('Ship it');

            await completeTodo(getTodos()[0].id);

            expect(getTodos()[1].completed).toBe(false);
        });

        it('the completion should be saved so it survives a page reload', async () => {
            await addTodo('Write tests');

            await completeTodo(getTodos()[0].id);

            expect((await repository.getAll())[0].completed).toBe(true);
        });
    });

    describe('When a todo is removed', () => {
        it('the todo should no longer be shown', async () => {
            await addTodo('Write tests');

            await removeTodo(getTodos()[0].id);

            expect(getTodos()).toHaveLength(0);
        });

        it('other todos should still be shown', async () => {
            await addTodo('Write tests');
            await addTodo('Ship it');

            await removeTodo(getTodos()[0].id);

            expect(getTodos()).toHaveLength(1);
            expect(getTodos()[0].text).toBe('Ship it');
        });

        it('the removal should be saved so it survives a page reload', async () => {
            await addTodo('Write tests');

            await removeTodo(getTodos()[0].id);

            expect(await repository.getAll()).toHaveLength(0);
        });
    });
});
