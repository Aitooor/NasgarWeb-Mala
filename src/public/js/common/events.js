var EventEmitter = /** @class */ (function () {
    function EventEmitter(opts) {
        this._events = {};
        this._eventNames = [];
        this._eventNames = opts;
    }
    EventEmitter.prototype.emit = function (name, args) {
        var ev = this._events[name];
        if (ev == null)
            return;
        for (var _i = 0, ev_1 = ev; _i < ev_1.length; _i++) {
            var fn = ev_1[_i];
            fn.apply(void 0, args);
        }
        return;
    };
    EventEmitter.prototype.on = function (name, listener) {
        if (!this._eventNames.includes(name))
            return;
        var ev = this._events[name];
        if (ev == null) {
            this._events[name] = [];
            this.on(name, listener);
        }
        this.off(name, listener);
        ev.push(listener);
    };
    EventEmitter.prototype.addListener = function (name, listener) {
        this.on(name, listener);
    };
    EventEmitter.prototype.off = function (name, listener) {
        var ev = this._events[name];
        if (ev == null)
            return;
        this._events[name] = ev.filter(function (fn) {
            return fn !== listener;
        });
    };
    EventEmitter.prototype.removeListener = function (name, listener) {
        this.off(name, listener);
    };
    EventEmitter.prototype.removeAllListeners = function () {
        this._events = {};
    };
    EventEmitter.prototype.getListeners = function (name) {
        var ev = this._events[name];
        if (ev == null)
            return [];
        return ev.slice(0);
    };
    return EventEmitter;
}());
export { EventEmitter };
//# sourceMappingURL=events.js.map