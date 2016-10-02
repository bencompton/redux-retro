describe('Reducers', function () {
    describe('Initial state', function () {
        describe('When a reducer is called with no state passed in', function () {
            it('should return the reducer\'s initial state');
        });
    });
    describe('Handling dispatched actions', function () {
        describe('When the reducer is called with an action type bound to it', function () {
            it('should return the state that the bound function returns');
        });
        describe('When the reducer is called with an action type not bound to it', function () {
            it('should return the state passed to it');
        });
        describe('When a reducer is bound to action types A and B, and action type A is dispatched', function () {
            it('should call the bound reducer function for action A');
            it('should NOT call the bound reducer function for action B');
        });
    });
});

//# sourceMappingURL=Reducer.specs.js.map
