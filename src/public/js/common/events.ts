
export interface _listener {
	(...args: any[]): void;
}

export interface __events {
	[event: string]: _listener[];
}

export class EventEmitter {

	private _events: __events = {};
	private _eventNames: string[] = [];

	/**
	 * @param opts Event names
	 */
	constructor(opts: string[]) {
		this._eventNames = opts;
	}

	emit(name: string, args: any[]) {
		const ev = this._events[name];

		if(typeof ev === "undefined") return;

		for(const fn of ev) 
			fn(...args);

		return;
	}

	on(name: string, listener: _listener) {
		if(!this._eventNames.includes(name)) return;

		const ev = this._events[name];

		if(typeof ev === "undefined") {
			this._events[name] = [];
			this.on(name, listener);
			return;
		}

		this.off(name, listener);

		ev.push(listener);
	}

	addListener(name: string, listener: _listener) {
		this.on(name, listener);
	}

	off(name: string, listener: _listener) {
		const ev = this._events[name];

		if(typeof ev === "undefined") return;

		this._events[name] = ev.filter(fn => {
			return fn !== listener;
		});
	}

	removeListener(name: string, listener: _listener) {
		this.off(name, listener);
	}

	removeAllListeners() {
		this._events = {};
	}

	getListeners(name: string) {
		const ev = this._events[name];

		if(typeof ev === "undefined") return [];

		return ev.slice(0);
	}
}
