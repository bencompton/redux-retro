import { createReducer } from 'redux-retro';
import { CalculatorActions } from './CalculatorActions';

export const calculatorReducer = createReducer<number>(0)
    .bindAction(CalculatorActions.prototype.add,      (state, action) => state + action.payload)
    .bindAction(CalculatorActions.prototype.subtract, (state, action) => state - action.payload)
    .bindAction(CalculatorActions.prototype.multiply, (state, action) => state * action.payload)
    .bindAction(CalculatorActions.prototype.divide,   (state, action) => state / action.payload)
    .bindAction(CalculatorActions.prototype.clear,    () => 0);
