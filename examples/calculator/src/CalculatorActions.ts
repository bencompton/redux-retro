import { Actions } from 'redux-retro';

export class CalculatorActions extends Actions<number> {
    add(value: number) {
        return value;
    }

    subtract(value: number) {
        return value;
    }

    multiply(value: number) {
        return value;
    }

    divide(value: number) {
        return value;
    }

    clear() {
        return null;
    }
}
