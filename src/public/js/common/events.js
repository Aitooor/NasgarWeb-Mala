export class EventEmitter {
    constructor(opts) {
        this._events = {};
        this._eventNames = [];
        this._eventNames = opts;
    }
    emit(name, args) {
        const ev = this._events[name];
        if (ev == null)
            return;
        for (const fn of ev)
            fn(...args);
        return;
    }
    on(name, listener) {
        if (!this._eventNames.includes(name))
            return;
        const ev = this._events[name];
        if (ev == null) {
            this._events[name] = [];
            this.on(name, listener);
        }
        this.off(name, listener);
        ev.push(listener);
    }
    addListener(name, listener) {
        this.on(name, listener);
    }
    off(name, listener) {
        const ev = this._events[name];
        if (ev == null)
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
        if (ev == null)
            return [];
        return ev.slice(0);
    }
}
