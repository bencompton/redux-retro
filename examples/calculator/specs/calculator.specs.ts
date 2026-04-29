import { createStore, Store } from 'redux';
import { calculatorReducer } from '../src/calculatorReducer';
import { CalculatorActions } from '../src/CalculatorActions';

describe('Calculator Example', () => {
    let store: Store<number>;
    let actions: CalculatorActions;

    beforeEach(() => {
        store = createStore(calculatorReducer);
        actions = new CalculatorActions(store as any);
    });

    it('should start with a result of 0', () => {
        expect(store.getState()).toBe(0);
    });

    describe('add', () => {
        it('should add the value to the current result', () => {
            actions.add(5);
            expect(store.getState()).toBe(5);
        });
    });

    describe('subtract', () => {
        it('should subtract the value from the current result', () => {
            actions.add(10);
            actions.subtract(3);
            expect(store.getState()).toBe(7);
        });
    });

    describe('multiply', () => {
        it('should multiply the current result by the value', () => {
            actions.add(4);
            actions.multiply(3);
            expect(store.getState()).toBe(12);
        });
    });

    describe('divide', () => {
        it('should divide the current result by the value', () => {
            actions.add(12);
            actions.divide(4);
            expect(store.getState()).toBe(3);
        });
    });

    describe('clear', () => {
        it('should reset the result to 0', () => {
            actions.add(10);
            actions.clear();
            expect(store.getState()).toBe(0);
        });
    });

    describe('chained operations', () => {
        it('should produce the correct final result', () => {
            actions.add(10);       // 0 + 10 = 10
            actions.multiply(3);   // 10 * 3 = 30
            actions.subtract(6);   // 30 - 6 = 24
            actions.divide(4);     // 24 / 4 = 6
            expect(store.getState()).toBe(6);
        });
    });
});
