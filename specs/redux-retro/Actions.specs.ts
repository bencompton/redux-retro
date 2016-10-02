describe('Actions', () => {
    describe('Calling action methods', () => {
        describe('When an action method returns a payload that is not undefined or a promise', () => {
            it('should dispatch the action through the store');
            it('should dispatch with an action type string that is an uppercase version of the method name');
            it('should dispatch with a payload that is what the method returned');
        });
        
        describe('When an action returns a promise', () => {
            it('should not dispatch an action through the store');
        });

        describe('When an action returns nothing (undefined)', () => {
            it('should not dispatch an action through the store');
        });
    });

    describe('Manually dispatching an action', () => {
        it('should dispatch the action through the store');
    });
});