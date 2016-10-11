redux-retro
======

A [Redux](http://redux.js.org) add-on that brings back the clean, minimal-boilerplate syntax you enjoyed with classic Flux libraries like [Alt](http://alt.js.org), [Reflux](https://github.com/reflux/refluxjs), and [Flummox](http://acdlite.github.io/flummox), along with better [TypeScript](https://www.typescriptlang.org) support

[![Build Status](https://travis-ci.org/bencompton/redux-retro.svg?branch=master)](https://travis-ci.org/bencompton/redux-retro)

## Motivation

[Redux](http://redux.js.org) is an exceptional library that improves on Flux in a number of ways, propelling the state of the art in UI development forward. However, there are a number of ways that various Flux libraries improved the experiance over vanilla Flux, and Redux Retro aims to bring these improvements back to Redux.

#### Reduced Boilerplate

Many people preferred the boilerplate reduction that Flux libraries such as Alt, Reflux, and Flummox offered over vanilla Flux and much of the same syntactic sugar is also applicable to Redux. Redux retro aims to bring back this classic syntax.

#### Simpler Async Actions

While libraries like [Redux Saga](https://github.com/yelouafi/redux-saga) and [Redux Loop](https://github.com/redux-loop/redux-loop) are cool, at this time, the dust still hasn’t settled on the topic of asynchronous actions in Redux. Furthermore, libraries like Redux Saga and Redux Loop can make tasks like server rendering and integration testing (i.e., testing actions, asynchronous operations, and reducers together) more challenging, since it isn’t entirely trivial to track the completion of an action, along with its asynchronous operations and state changes. Many people are still using [Redux Thunk](https://github.com/gaearon/redux-thunk), but a lot of people don’t enjoy its syntax and find it difficult to test. Back in the good old days of Alt, Flummox, and Reflux, we just returned promises from our actions and called it a day. Redux Retro brings this back. That being said, Redux Saga, Redux Loop, Redux Thunk, Redux Promise, etc. should all be usable Redux Retro if desired.

#### Improved TypeScript Support

Support for TypeScript with vanilla Redux is lacking, and another goal of Redux Retro is improved TypeScript support.

## Who Should Use Redux Retro?

If you want to use TypeScript and have type safety between your actions and reducers, you should consider giving Redux Retro a try. Also, if you're familliar with classic Flux libraries like Alt, Redux, and Flummox and like the syntax of those libraries, you should also give Redux Retro a try. 

If you never used any Flux libraries before using Redux, you might consider reading the docs of some of the classic libraries and doing some additional research on how they differ from Redux. [This Github example](https://github.com/ethan-deng/Redux-vs-Alt), for instance, does a great job of comparing and contrasting Alt and Redux. If you haven’t already read through the excellent [Redux documentation](http://redux.js.org) and gained a full understanding of how it works, it is highly recommended that you do so before exploring Redux Retro. If you already fully understand Redux and like it just fine the way it is, then you can stop reading and just ignore Redux Retro. 

## Examples

### Actions

Many people object to using action type strings and constants, arguing that they violate the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) in that the knowledge of an action name is duplicated: the action creator function has the action name, the action type string repeats the action name, and when using constant variables, the action name is repeated yet a third time. Also, many people like action functions that automatically dispatch. Redux Retro addresses both of these concerns. For example:

#### Actions in Vanilla Redux

```javascript
import {store} from 'Store';

//Action names specified twice in const variable declarations
export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT';
export const MULTIPLY = 'MULTIPLY';
export const DIVIDE = 'DIVIDE';

export const add = (value) => {
    type: ADD,
    payload: value;
};

//Action names specified a third time in the action creator function names
export const subtract = (value) => {
    return {
        type: SUBTRACT,
        payload: value
    };
};

export const multiply = (value) => {
    return {
        type: MULTIPLY,
        payload: value
    };
};

export const divide = (value) => {
    return {
        type: DIVIDE,
        payload: value
    };
};

store.dispatch(add(5));
```

#### Actions in Redux Retro

Libraries like Alt and Flummox automatically generate the action type string from the action method name, and automatically dispatch actions through the dispatcher. Redux Retro brings this back.

```javascript
import {store} from 'Store';

export class CalculatorActions extends Actions {
    add(value) {
        return value;
    }

    subtract(value) {
        return value;
    }

    multiply(value) {
        return value;
    }

    divide(value) {
        return value;
    }
}

export calculatorActions = new CalculatorActions(store);

//Calling an action method dispatches that action through the Redux store for you. 
//For example, the following code dispatches this action behind the scenes:
//
//{
//	type: 'ADD',
//	payload: 5
//}

calculatorActions.add(5);
```
### Reducers

Many people dislike switch statements in reducers, and while [Redux Actions](https://github.com/acdlite/redux-actions), for example, eliminates the need for switch statements, it does not eliminate action type strings / constants.

#### Reducer in Vanilla Redux

```javascript
import {ADD, SUBTRACT, MULTIPLY, DIVIDE} from 'CalculatorActions';

const calculatorReducer = (state = 0, action) => {
    switch (action.type) {
        case ADD:
            return state + action.payload;
        case SUBTRACT:
            return state - action.payload;
        case MULTIPLY:
            return state * action.payload;
        case DIVIDE:
            return state / action.payload;
        default:
            return state;
    }
};
```

#### Reducer in Redux Retro

Redux Retro introduces new reducer syntax that is free of switch statements and action type strings / constants. It creates a single reducer function that can be bound to actions like so:

```javascript
import {CalculatorActions} from 'CalculatorActions'

const calculatorReducer = createReducer(0)
    .bindAction(CalculatorActions.prototype.add, (state, action) => {
        return state + action.payload;
    })
    .bindAction(CalculatorActions.prototype.subtract, (state, action) => {
        return state - action.payload;
    })
    .bindAction(CalculatorActions.prototype.multiply, (state, action) => {
        return state * action.payload;
    })
    .bindAction(CalculatorActions.prototype.divide, (state, action) => {
        return state / action.payload;
    });
```

Note that the generated reducer function is just a plain function that is equivalent in its inputs and outputs to the reducer function above created with vanilla Redux, and is therefore fully compatible with the rest of the Redux ecosystem. For example, this reducer function can be called like so if the need ever arises:

```javascript
calculatorReducer(0, {
	type: 'ADD',
	payload: 5
});

//New state is 5
```

### Improved TypeScript Support

With vanilla Redux, actions and reducers are linked only by an action type string (or constant) and switch statements. This does not give TypeScript enough information to know whether or not the actions and reducers match up. Therefore, TypeScript cannot provide compile-time checking for action and reducer mismatches.

With Redux Retro on the other hand, actions and reducers are linked in a strongly-typed manner.

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

//This compiles successfully
const todoReducer1 = createReducer<ITodo[]>(
		[]
	)
    .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    	return [...state, action.payload];
    });

//Compilation fails on this one
const todoReducer2 = createReducer<ITodo[]>(
		[]
	)
    .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    	//Trying to return action payload, which is a single ITodo instead of an array
    	return action.payload;
    });

//Compilation also fails on this one
const todoReducer3 = createReducer<ITodo[]>(
		[]
	)
    .bindAction(TodoActions.prototype.addTodo, (state, action) => {
    	//Oops, completed doesn't exist on ITodo!
    	let completed = action.payload.completed;
    	return [...state, action.payload];
    });
```

### Asyncronous Actions

Many people like the simplicity of tracking the completion of an action, its asynchronous effects, and state changes via promises. This is not so trivial in libraries like Redux Saga and Redux Loop, so people often stick with Redux Thunk. Many people, however, don't like the syntax of Redux Thunk, and it can be especially difficult to read in TypeScript.

Here is how asynchronous actions look in Redux Retro:  

```javascript

class TodoActions extends Actions {
    fetchTodos() {
        return fetch('todos/')
            .then(todoFetchSuccessful)
            .catch(todoFetchFailed)
    }

    todoFetchSuccessful(todos) {
        return todos;
    }

    todoFetchFailed(error) {
        return error;
    }
}

```

NOTE: When an action returns a promise, nothing gets dispatched through the store and no reducers are called. Normally, such an action will call another action when the promise resolves, and that action will then return something other than a promise (e.g., the fetched data), which in turn will get dispatched.  

### Checking State from Actions

Accessing app state from actions is often necessary for decision-making within actions. Therefore, Redux Retro's base action class has a handy getState() method.

```javascript

class ShoppingCartActions extends Actions {
    addToCart(itemId) {
        //Only add to cart if not already added, and don't return anything otherwise
        if (this.getState().cart.items.indexOf(itemId) != -1) {
            return itemId;
        }
    }
}

```
NOTE: In cases like this where an action doesn't return anything (or explicitly returns undefined), nothing gets dispatched through the store, and no reducers are called. In cases where an action doesn't need to return a payload, but reducers need to be called, simply return null.
