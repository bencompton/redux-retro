describe('Actions', () => {
    describe('Calling action methods', () => {
        describe('When an action method returns a payload that is not undefined or a promise', () => {
            xit('should dispatch the action through the store');
            xit('should dispatch with an action type string that is an uppercase version of the method name');
            xit('should dispatch with a payload that is what the method returned');
        });
        
        describe('When an action returns a promise', () => {
            xit('should not dispatch an action through the store');
        });

        describe('When an action returns nothing (undefined)', () => {
            xit('should not dispatch an action through the store');
        });
    });

    describe('Manually dispatching an action', () => {
        xit('should dispatch the action through the store');
    });
});