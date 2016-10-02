"use strict";
var Actions = (function () {
    function Actions(store) {
        this.store = store;
        this.reconfigureActions();
    }
    Actions.prototype.getState = function () {
        return this.store.getState();
    };
    Actions.prototype.convertMethodNameToActionType = function (methodName) {
        return methodName.replace(/[a-z]([A-Z])/g, function (i) {
            return i[0] + "_" + i[1].toLowerCase();
        }).toUpperCase();
    };
    Actions.prototype.checkIfPromise = function (obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    };
    Actions.prototype.generateWrapperFunction = function (member) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var payload = member.apply(_this, args);
            if (payload !== undefined && !_this.checkIfPromise(payload)) {
                _this.dispatch({
                    type: member.actionType,
                    payload: payload
                });
            }
            return payload;
        };
    };
    Actions.prototype.reconfigureActions = function () {
        var prototype = this.constructor.prototype;
        for (var i in prototype) {
            var member = prototype[i];
            if (typeof member == 'function' && prototype.hasOwnProperty(i)) {
                var actionType = this.convertMethodNameToActionType(i);
                member.actionType = actionType;
                this[i] = this.generateWrapperFunction(member);
            }
        }
    };
    Actions.prototype.dispatch = function (action) {
        this.store.dispatch(action);
    };
    return Actions;
}());
exports.Actions = Actions;

//# sourceMappingURL=Actions.js.map
