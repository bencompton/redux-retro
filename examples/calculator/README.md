# Calculator Example

A minimal example demonstrating the core `redux-retro` API: action classes and reducers.

## What it shows

- Defining an `Actions` subclass with typed action methods
- Binding reducers to action methods with `createReducer().bindAction()`
- Return-value style reducers (appropriate for primitive state like `number`)
- Wiring everything together with a Redux store

## Running the tests

```sh
npm test
```

## Key files

### `CalculatorActions.ts`

```ts
import { Actions } from 'redux-retro';

export class CalculatorActions extends Actions<number> {
    add(value: number)      { return value; }
    subtract(value: number) { return value; }
    multiply(value: number) { return value; }
    divide(value: number)   { return value; }
    clear()                 { return null; }
}
```

Action type strings are automatically derived from method names (`add` → `ADD`, `multiply` → `MULTIPLY`, etc.). Calling any method automatically dispatches through the store — no manual `dispatch()` needed.

### `calculatorReducer.ts`

```ts
export const calculatorReducer = createReducer<number>(0)
    .bindAction(CalculatorActions.prototype.add,      (state, action) => state + action.payload)
    .bindAction(CalculatorActions.prototype.subtract, (state, action) => state - action.payload)
    .bindAction(CalculatorActions.prototype.multiply, (state, action) => state * action.payload)
    .bindAction(CalculatorActions.prototype.divide,   (state, action) => state / action.payload)
    .bindAction(CalculatorActions.prototype.clear,    () => 0);
```

Reducers bind directly to action method references — no switch statements, no action type string constants. TypeScript infers the payload type of each bound reducer from the action method's return type.
