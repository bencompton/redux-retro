describe('Actions', function () {
    describe('Calling action methods', function () {
        describe('When an action method returns a payload that is not undefined or a promise', function () {
            it('should dispatch the action through the store');
            it('should dispatch with an action type string that is an uppercase version of the method name');
            it('should dispatch with a payload that is what the method returned');
        });
        describe('When an action returns a promise', function () {
            it('should not dispatch an action through the store');
        });
        describe('When an action returns nothing (undefined)', function () {
            it('should not dispatch an action through the store');
        });
    });
    describe('Manually dispatching an action', function () {
        it('should dispatch the action through the store');
    });
});

//# sourceMappingURL=Actions.specs.js.map
