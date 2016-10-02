describe('Reducers', () => {
    describe('Initial state', () => {
        describe('When a reducer is called with no state passed in', () => {
            it('should return the reducer\'s initial state');
        });
    });

    describe('Handling dispatched actions', () => {
        describe('When the reducer is called with an action type bound to it', () => {
            it('should return the state that the bound function returns');
        });

        describe('When the reducer is called with an action type not bound to it', () => {
            it('should return the state passed to it');
        })

        describe('When a reducer is bound to action types A and B, and action type A is dispatched', () => {
            it('should call the bound reducer function for action A');
            it('should NOT call the bound reducer function for action B');
        });
    });
});