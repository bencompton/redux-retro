redux-retro
======

Bring back the clean, minimal-boilerplate syntax you enjoyed with classic Flux libraries like [Alt](http://alt.js.org), [Reflux](http://github.com/reflux/refluxjs), and [Flummox](http://acdlite.github.io/flummox), along with better TypeScript support.

## Motivation

[Redux](http://redux.js.org) is an exceptional library that improves on Flux in a number of ways, propelling the state of the art in UI development forward. However, there are a few areas where people accustomed to various Flux libraries may find room for improvement:

#### Reduced Action Boilerplate

Many people preferred the boilerplate reduction that Flux libraries such as Alt, Reflux, and Flummox offered over vanilla Flux and much of the same syntactic sugar is also applicable to Redux. Redux retro aims to bring back this classic syntax.

#### Simpler Async Actions

While libraries like Redux Saga and Redux Loop are cool, at this time, the dust still hasn’t settled on the topic of asynchronous actions in redux. Furthermore, libraries like Redux Saga and Redux Loop can make tasks like server rendering and integration testing (i.e., testing actions, asynchronous operations, and reducers together) more challenging, since it isn’t entirely trivial to track the completion of an action, its asynchronous operations, and state changes. Many people are still using redux-thunk, but a lot of people don’t enjoy its syntax and find it difficult to test. Back in the good old days of Alt, Flummox, and Reflux, we just returned promises from our action methods and called it a day. Redux retro brings this back. That being said, Redux Saga, Redux Loop, Redux Thunk, Redux Promise, etc. can all be used with redux-retro if desired.

#### Improved TypeScript Support

In addition, support for TypeScript with vanilla Redux is lacking, and another goal of Redux Retro is improved TypeScript support.

## Pre-requisites

If you haven’t already read through the excellent [Redux documentation](http://) and gained a full understanding of how it works, it is highly recommended that you do so before exploring Redux Retro. If you fully understand Redux and like it just fine the way it is, then you can stop reading and just ignore Redux Retro. If you have never used any Flux libraries before using Redux, you might consider reading the docs of some of the classic libraries and doing some additional research on how they differ from Redux. [This Github example](https://github.com/ethan-deng/Redux-vs-Alt), for instance, does a great job of comparing and contrasting Alt and Redux.

## Examples

### Actions in Vanilla Redux

Many people object to using action type strings and constants, arguing that they violate the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) in that the knowledge of an action name is duplicated: the action creator function has the action name, the action type string repeats the action name, and when using constant variables, the action name is repeated yet a third time. For example:

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

### Actions in Redux Retro

Libraries like Alt and Flummox addressed this by automatically generating the action type string from the action method name, and Redux Retro brings this back.

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

//Calling an action method dispatches that action through the Redux store for you. For example, the following code dispatches this action behind the scenes:
//
//{
//	type: 'ADD',
//	payload: 5
//}

calculatorActions.add(5);
```

### Reducer in Vanilla Redux

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

### Reducer in Redux Retro

Many people dislike switch statements in reducers, and while [Redux Actions](https://github.com/acdlite/redux-actions), for example, eliminates the need for switch statements, it does not eliminate action type strings / constants.

```javascript
import {CalculatorActions} from 'CalculatorActions'

const calculatorReducer = createReducer(0)
    .bindAction(calculatorActions.prototype.add, (state, action) => {
        return state + action.payload;
    })
    .bindAction(calculatorActions.prototype.subtract, (state, action) => {
        return state - action.payload;
    })
    .bindAction(calculatorActions.prototype.multiply, (state, action) => {
        return state * action.payload;
    })
    .bindAction(calculatorActions.prototype.divide, (state, action) => {
        return state / action.payload;
    });
```

Note that the generated reducer function is just a plain function that is equivalent in its inputs and outputs to the  reducer function above created with vanilla Redux, and is therefore fully compatible with the rest of the Redux ecosystem. For example, this reducer function can be called like so:

```javascript
calculatorReducer(0, {
	type: 'ADD',
    payload: 5
});

//New state is 5
```

### Improved TypeScript Support

```javascript
interface ITodo {
	id: number;
	text: string;
}

class TodoActions {
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
    	let completed = action.completed;
    	return [...state, action.payload];
    });
```

### Asyncronous Actions

Coming soon...