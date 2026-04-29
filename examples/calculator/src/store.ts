import { createStore } from 'redux';
import { calculatorReducer } from './calculatorReducer';
import { CalculatorActions } from './CalculatorActions';

export const store = createStore(calculatorReducer);
export const calculatorActions = new CalculatorActions(store as any);
