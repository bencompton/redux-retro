"use strict";
exports.reducer = {
    generateActionBinder: function (boundActions, mainReducer) {
        return {
            bindAction: function (action, actionReducer) {
                boundActions.push({
                    payloadCreatorMethod: action,
                    reducerFunction: actionReducer
                });
                return mainReducer;
            }
        };
    },
    generateReducerFunction: function (boundActions, initialState) {
        var reducerFunction = function (state, action) {
            state = state || initialState;
            for (var i = 0; i < boundActions.length; i++) {
                var boundAction = boundActions[i];
                if (boundAction.payloadCreatorMethod.actionType === action.type) {
                    return boundAction.reducerFunction(state, action);
                }
            }
            return state;
        };
        reducerFunction.bindAction = exports.reducer.generateActionBinder(boundActions, reducerFunction).bindAction;
        return reducerFunction;
    },
    createReducer: function (initialState) {
        var boundActions = [];
        return exports.reducer.generateReducerFunction(boundActions, initialState);
    }
};
exports.createReducer = exports.reducer.createReducer;

//# sourceMappingURL=Reducer.js.map
