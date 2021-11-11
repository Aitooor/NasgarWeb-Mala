export class EventEmitter {
    constructor(opts) {
        this._events = {};
        this._eventNames = [];
        this._eventNames = opts;
    }
    emit(name, args) {
        const ev = this._events[name];
        if (typeof ev === "undefined")
            return;
        for (const fn of ev)
            fn(...args);
        return;
    }
    on(name, listener) {
        if (!this._eventNames.includes(name))
            throw new TypeError("That event doesn't exists. " + name);
        const ev = this._events[name];
        if (typeof ev === "undefined") {
            this._events[name] = [];
            this.on(name, listener);
            return;
        }
        this.off(name, listener);
        ev.push(listener);
    }
    addListener(name, listener) {
        this.on(name, listener);
    }
    off(name, listener) {
        const ev = this._events[name];
        if (typeof ev === "undefined")
            return;
        this._events[name] = ev.filter(fn => {
            return fn !== listener;
        });
    }
    removeListener(name, listener) {
        this.off(name, listener);
    }
    removeAllListeners() {
        this._events = {};
    }
    getListeners(name) {
        const ev = this._events[name];
        if (typeof ev === "undefined")
            return [];
        return ev.slice(0);
    }
}
//# sourceMappingURL=events.js.map