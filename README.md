Redux Retro
======

A [Redux](http://redux.js.org) add-on that reduces boilerplate, improves [TypeScript](https://www.typescriptlang.org) type safety, and brings a class-based action model that makes complex business logic and async I/O easy to test.

[![Build Status](https://travis-ci.org/bencompton/redux-retro.svg?branch=master)](https://travis-ci.org/bencompton/redux-retro)

## Motivation

[Redux Toolkit](https://redux-toolkit.js.org) (RTK) is the current official recommendation for writing Redux logic, and it genuinely solves many of Redux's original pain points — `createSlice` eliminates action type constants, `createAsyncThunk` handles async patterns, and TypeScript support is solid. So why would you choose Redux Retro instead?

The short answer: **Redux Retro treats actions as classes**, which enables a different, more testable architecture that RTK's function-centric model cannot replicate as cleanly.

#### Cleaner Syntax with Less Boilerplate

Redux Toolkit's `createSlice` and `createAsyncThunk` are improvements over vanilla Redux, but they still require you to wire up action creators, export them, import them elsewhere, and call `dispatch()` manually at every call site. Redux Retro eliminates all of that. Action classes auto-dispatch when their methods are called, action type strings are derived automatically from method names, and reducers bind directly to action methods with no constants or string matching.

Compare a simple counter in each:

**Redux Toolkit**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    add: (state, action: PayloadAction<number>) => state + action.payload,
    subtract: (state, action: PayloadAction<number>) => state - action.payload,
  },
});

export const { add, subtract } = counterSlice.actions;
export default counterSlice.reducer;

// At the call site — dispatch must be called explicitly every time
dispatch(add(5));
```

**Redux Retro**

```typescript
import { Actions, createReducer } from 'redux-retro';

export class CalculatorActions extends Actions<number> {
  add(value: number) { return value; }
  subtract(value: number) { return value; }
}

export const calculatorActions = new CalculatorActions(store);

// Dispatches automatically — no dispatch() call needed
calculatorActions.add(5);

export const calculatorReducer = createReducer<number>(0)
  .bindAction(CalculatorActions.prototype.add, (state, action) => state + action.payload)
  .bindAction(CalculatorActions.prototype.subtract, (state, action) => state - action.payload);
```

#### Class-Based Actions for Domain Logic

Redux Retro's `Actions` base class is designed to work like an MVC controller. Rather than thin functions that only return payloads, action classes can:

- Coordinate multi-step domain logic across multiple actions
- Read current app state via `this.getState()`
- Compose async workflows with `async`/`await` using natural, readable syntax
- Encapsulate decision-making and orchestration in one cohesive place

This is a fundamentally different model from RTK's `createAsyncThunk`, which relies on middleware-dispatched thunks and can make it harder to express complex conditional logic or multi-action sequences in a clean, readable way.

#### Constructor-Injected Dependencies for Strong Testability

Because actions are classes, their dependencies — particularly async I/O such as API clients, storage adapters, or timers — can be **constructor-injected**. This means you can substitute lightweight mock implementations in tests without any mocking frameworks, module interception, or patching of globals.

```typescript
interface ITodoApi {
  getTodos(): Promise<ITodo[]>;
}

class TodoActions extends Actions<IAppState> {
  constructor(store: Store<IAppState>, private api: ITodoApi) {
    super(store);
  }

  async fetchTodos() {
    try {
      const todos = await this.api.getTodos();
      this.fetchTodosSucceeded(todos);
    } catch (error) {
      this.fetchTodosFailed(error);
    }
  }

  fetchTodosSucceeded(todos: ITodo[]) {
    return todos;
  }

  fetchTodosFailed(error: Error) {
    return error;
  }
}
```

In tests, simply pass in a mock `api` — no `jest.mock()`, no module factory, no middleware setup, no MSW server:

```typescript
const mockApi: ITodoApi = {
  getTodos: async () => [{ id: 1, text: 'Write tests' }]
};

const actions = new TodoActions(store, mockApi);
await actions.fetchTodos();

expect(store.getState().todos).toHaveLength(1);
```

Testing async logic in RTK typically requires configuring a test store with middleware and either mocking `fetch`/`axios` globally. The constructor injection pattern here eliminates that infrastructure entirely.

#### Improved TypeScript Type Safety

Both Redux Toolkit and Redux Retro offer TypeScript support, but the mechanisms differ. RTK infers types from `createSlice` definitions, which works well for straightforward cases but requires extra ceremony with `PayloadAction<T>` annotations and typed hooks for anything beyond simple reducers.

Redux Retro binds reducers directly to action method *references* — not strings — so the TypeScript compiler knows the exact payload type of every bound action and will catch mismatches at compile time:

```typescript
interface ITodo {
  id: number;
  text: string;
}

class TodoActions extends Actions<ITodo[]> {
  addTodo(todo: ITodo) {
    return todo;
  }
}

// ✅ This compiles successfully — return-value style
const todoReducer = createReducer<ITodo[]>([])
  .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    return [...state, action.payload];
  });

// ✅ This also compiles successfully — immer mutation style
const todoReducerImmer = createReducer<ITodo[]>([])
  .bindAction(TodoActions.prototype.addTodo, (draft, action) => {
    draft.push(action.payload);
  });

// ❌ Compile error: action.payload is ITodo, not ITodo[]
const badReducer1 = createReducer<ITodo[]>([])
  .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    return action.payload;
  });

// ❌ Compile error: 'completed' does not exist on ITodo
const badReducer2 = createReducer<ITodo[]>([])
  .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    const completed = action.payload.completed;
    return [...state, action.payload];
  });
```

#### Designed for React Redux Retro

Redux Retro is designed to pair with [React Redux Retro](https://github.com/bencompton/react-redux-retro), which provides a clean separation of concerns between React components and app logic via `Connect`, `mapStateToProps`, and `mapActionsToProps`.

Every container in a React Redux Retro app defines what state and what actions a component needs. This means **the set of all containers forms a top-level API for your app's interesting logic** — state derivation and action invocation — which can be exercised in integration tests independently of React. Tests can instantiate the store, inject mock dependencies into action classes, call actions through the container's mapped API, and assert on resulting state, all without rendering a single component.

## Who Should Use Redux Retro?

Redux Retro is a good fit if you:

- Want **constructor-injected, mockable dependencies** in your action layer for clean, fast unit and integration tests
- Want action classes that work like **MVC controllers**, coordinating domain logic in one cohesive place
- Value **reduced boilerplate** and prefer dispatching to be automatic rather than explicit at every call site
- Are building a React app with [React Redux Retro](https://github.com/bencompton/react-redux-retro) and want a well-defined, testable top-level app API

Redux Retro may **not** be the best fit if you:

- Are already deeply invested in the Redux Toolkit ecosystem and its conventions, including RTK Query for data fetching
- Need tight integration with RTK-specific middleware or tooling that depends on RTK's action creator metadata
- Prefer a purely functional style and have no interest in class-based patterns
- Have simple state needs where even RTK would be overkill, and a lighter solution (React context, Zustand, Jotai) would serve you better

## Examples

### Actions

Action type strings are automatically derived from method names (camelCase converted to UPPER_SNAKE_CASE), and calling any action method automatically dispatches through the Redux store — no manual `dispatch()` calls needed anywhere.

#### Actions in Vanilla Redux

```javascript
import { store } from 'Store';

export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT';
export const MULTIPLY = 'MULTIPLY';
export const DIVIDE = 'DIVIDE';

export const add = (value) => ({ type: ADD, payload: value });
export const subtract = (value) => ({ type: SUBTRACT, payload: value });
export const multiply = (value) => ({ type: MULTIPLY, payload: value });
export const divide = (value) => ({ type: DIVIDE, payload: value });

store.dispatch(add(5));
```

#### Actions in Redux Retro

```javascript
import { Actions } from 'redux-retro';

export class CalculatorActions extends Actions {
  add(value) { return value; }
  subtract(value) { return value; }
  multiply(value) { return value; }
  divide(value) { return value; }
}

export const calculatorActions = new CalculatorActions(store);

// Automatically dispatches: { type: 'ADD', payload: 5 }
calculatorActions.add(5);
```

### Reducers

Redux Retro eliminates switch statements and action type strings from reducers entirely. Reducers bind directly to action method references. Under the hood, every bound reducer is wrapped with [immer](https://immerjs.github.io/immer/)'s `produce`, so you can choose between two styles — returning a new state value, or mutating a draft directly — in exactly the same way as [Redux Toolkit](https://redux-toolkit.js.org/usage/immer-reducers).

#### Reducer in Vanilla Redux

```javascript
import { ADD, SUBTRACT, MULTIPLY, DIVIDE } from 'CalculatorActions';

const calculatorReducer = (state = 0, action) => {
  switch (action.type) {
    case ADD:      return state + action.payload;
    case SUBTRACT: return state - action.payload;
    case MULTIPLY: return state * action.payload;
    case DIVIDE:   return state / action.payload;
    default:       return state;
  }
};
```

#### Reducer in Redux Retro — Return-Value Style

For simple or primitive state, return the next state value directly:

```javascript
import { createReducer } from 'redux-retro';
import { CalculatorActions } from 'CalculatorActions';

const calculatorReducer = createReducer(0)
  .bindAction(CalculatorActions.prototype.add,      (state, action) => state + action.payload)
  .bindAction(CalculatorActions.prototype.subtract, (state, action) => state - action.payload)
  .bindAction(CalculatorActions.prototype.multiply, (state, action) => state * action.payload)
  .bindAction(CalculatorActions.prototype.divide,   (state, action) => state / action.payload);
```

#### Reducer in Redux Retro — Immer Mutation Style

For complex or nested object/array state, mutate the immer draft directly and return nothing. Immer produces a new immutable state automatically — the original state is never modified:

```javascript
import { createReducer } from 'redux-retro';
import { TodoActions } from 'TodoActions';

const todoReducer = createReducer([])
  .bindAction(TodoActions.prototype.addTodo, (draft, action) => {
    draft.push(action.payload);                       // mutate draft directly
  })
  .bindAction(TodoActions.prototype.completeTodo, (draft, action) => {
    const todo = draft.find(t => t.id === action.payload);
    if (todo) todo.completed = true;                  // nested mutation, no spread needed
  })
  .bindAction(TodoActions.prototype.removeTodo, (draft, action) => {
    const index = draft.findIndex(t => t.id === action.payload);
    if (index !== -1) draft.splice(index, 1);
  });
```

> **Note:** You can freely mix both styles across different `bindAction` calls on the same reducer. If a bound reducer returns a value, that value becomes the new state. If it returns `undefined` (i.e., returns nothing), immer uses the mutated draft instead.

The generated reducer is a plain Redux reducer function, fully compatible with the rest of the Redux ecosystem:

```javascript
calculatorReducer(0, { type: 'ADD', payload: 5 }); // => 5
```

### Asynchronous Actions

Async action methods return a promise. Redux Retro detects this and does not dispatch anything for the async method itself. Instead, the async method drives the workflow and calls other action methods when it has results to dispatch.

```javascript
class TodoActions extends Actions {
  async fetchTodos() {
    try {
      const todos = await this.api.getTodos();
      this.fetchTodosSucceeded(todos);
    } catch (error) {
      this.fetchTodosFailed(error);
    }
  }

  fetchTodosSucceeded(todos) {
    return todos;  // dispatched
  }

  fetchTodosFailed(error) {
    return error;  // dispatched
  }
}
```

### Checking State from Actions

`this.getState()` is available in any action method for reading current app state before deciding what to do:

```javascript
class ShoppingCartActions extends Actions {
  addToCart(itemId) {
    // Only add if not already in cart
    if (this.getState().cart.items.indexOf(itemId) === -1) {
      return itemId;  // dispatched
    }
    // Returning undefined dispatches nothing
  }
}
```

> **Note:** When an action method returns `undefined` (or nothing), no dispatch occurs and no reducers run. When a dispatch is needed but there is no meaningful payload, return `null`.
