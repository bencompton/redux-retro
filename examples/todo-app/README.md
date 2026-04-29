# Todo App Example

A full-stack example demonstrating how `redux-retro` and `react-redux-retro` work together in a real React app. It covers async actions, constructor-injected repository dependencies, IndexedDB persistence, React components, containers, and headless acceptance tests.

## What it shows

- **Async action workflows** — async methods drive I/O; synchronous `*Succeeded` methods dispatch the results
- **Constructor-injected dependencies** — `TodoActions` accepts an `ITodoRepository`, making it trivial to substitute a `MockTodoRepository` in tests with no mocking framework
- **Repository pattern** — `ITodoRepository` abstracts over persistence; `IndexedDbTodoRepository` and `MockTodoRepository` are the two implementations
- **React integration** — components, containers with exported `mapStateToProps` / `mapActionsToProps`, and a `Provider` wrapping the tree
- **Headless acceptance tests** — tests drive the app through the same container API the UI uses, without rendering any React

## Running the tests

```sh
npm test
```

Tests exercise the app headlessly through the container `mapStateToProps` / `mapActionsToProps` functions — the same API the UI components use — without rendering any React components.

## Running the app

**With IndexedDB persistence (real):**

```sh
npm run dev
```

**With in-memory mock persistence:**

```sh
npm run dev:mock
```

`npm run dev:mock` passes `--mode mock` to Vite. The entry point reads `import.meta.env.MODE` and dynamically imports either `setup-full.ts` (IndexedDB) or `setup-mocks.ts` (in-memory). Vite tree-shakes the unused branch, so the production bundle contains only the real repository.

## Architecture highlights

### Async actions with `*Succeeded` dispatch methods

Async methods drive I/O but do not dispatch anything themselves. They call synchronous `*Succeeded` methods once the work is done, which return payloads and are auto-dispatched by Redux Retro. The reducer binds only to the `*Succeeded` methods.

```ts
async addTodo(text: string) {
    const todo = await this.repository.add(text);
    this.addTodoSucceeded(todo);   // ← dispatched
}

addTodoSucceeded(todo: ITodo) {
    return todo;                   // ← reducer handles this
}
```

### Constructor-injected repository

```ts
export class TodoActions extends Actions<ITodoAppState> {
    constructor(store: Store<ITodoAppState>, repository: ITodoRepository) {
        super(store);
        this.repository = repository;
    }
    // ...
}
```

In tests, pass a `MockTodoRepository`. No `jest.mock()`, no module interception, no global patching:

```ts
const repository = new MockTodoRepository();
const store = createAppStore();
const actions = getActions(store, repository);
```

### Containers as a testable API

Each container exports its mapping functions independently:

```ts
export const mapStateToProps = (state: ITodoAppState) => ({ todos: state.todos });
export const mapActionsToProps = (actions: ITodoAppActions) => ({
    onComplete: (id: number) => actions.completeTodo(id),
    onRemove:   (id: number) => actions.removeTodo(id)
});
export const TodoListContainer = connect(mapStateToProps, mapActionsToProps, TodoList);
```

Tests import these functions directly and use them as the app's public API, giving full confidence that the UI wiring is correct:

```ts
const getTodos  = () => todoListState(store.getState()).todos;
const addTodo   = (text: string) => addTodoActions(actions).onAdd(text);
const complete  = (id: number) => todoListActions(actions).onComplete(id);
```
