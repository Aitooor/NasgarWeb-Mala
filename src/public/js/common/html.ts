
export function query<T extends HTMLElement = HTMLElement>(str: string, parent: Document | HTMLElement = document): T {
	return parent.querySelector<T>(str);
}

export function queryAll<T extends HTMLElement = HTMLElement>(str: string, parent: Document | HTMLElement = document): T[] {
	return Array.from<T>(parent.querySelectorAll<T>(str));
}

export interface middlewareEvents_return {
	removeAll(): void;
	add(...args: any[]): void;
	rem(...args: any[]): void;
	eventNames: string[];
	events: {
		[event: string]: Function[];
	};
}

export function middlewareEvents(element: HTMLElement): middlewareEvents_return {
	const original_a = element.addEventListener;
	const original_r = element.removeEventListener;
	let eventNames: string[] = [];
	const events: {[k: string]: Function[]; } = {};

	element.addEventListener = function(...args: any[]) {
		const name: string = args[0];
		const listener: Function = args[1];

		if(events[name] == null) events[name] = [];
		if(!events[name].includes(listener))
			events[name].push(listener);

		eventNames = Object.keys(events);

		original_a.call(element, ...args);
	};
	
	element.removeEventListener = function(...args: any[]) {
		const name: string = args[0];
		const listener: Function = args[1];

		if(events[name] == null) events[name] = [];
		events[name].filter(_ => _ !== listener);
		if(events[name].length === 0)
			events[name] = undefined;

		eventNames = Object.keys(events);

		original_r.call(element, ...args);
	}

	return {
		removeAll() {
			for(const ev of eventNames)
				for(const fn of events[ev])
					// @ts-ignore
					element.removeEventListener(ev, fn);
		},

		add: element.addEventListener,
		rem: element.removeEventListener,

		get eventNames() {
			return eventNames.slice(0);
		},

		get events() {
			return events;
		}
	};
}

export interface json_html<T extends HTMLElement = HTMLElement> {
	readonly dom: T;
	readonly elm: string;
	readonly classes: DOMTokenList;
	readonly attrs: {
		[attribute: string]: string;
	};
	readonly events: middlewareEvents_return;
	readonly hasChilds: boolean;
	readonly childs: json_html<HTMLElement>[];
	readonly _: {
		[element: string]: json_html<HTMLElement>;
	};

	addChild<T extends HTMLElement = HTMLElement>(child: T): json_html<T>;
}

export function structureCopy<T extends HTMLElement>(element: T): json_html<T> {
	const me: json_html<T> = {
		dom: element,
		elm: element.nodeName.toLowerCase(),
		classes: element.classList,
		attrs: {},
		events: middlewareEvents(element),
		hasChilds: element.hasChildNodes(),
		childs: [],
		_: {},
		// @ts-ignore
		addChild() {}
	};

	me.addChild = function<T extends HTMLElement = HTMLElement>(child: T): json_html<T> {
		if(child.nodeName === "#text") {
			throw new TypeError("Child is a text");
		}

		const tag = child.nodeName.toLowerCase();
		const name = child.dataset.name || null;
		const prop = name || tag;
		const sameTags = Object.keys(me._).filter(_ => _.match(new RegExp(`^${prop}\d*$`)) !== null);

		const structure = structureCopy<T>(child);

		me._[prop + (sameTags.length || "")] = structure;


		me.childs.push(structure);

		return structure;
	}

	/*—————— Attributes ——————*/
	const attributeNames = element.getAttributeNames();
	for(const attr of attributeNames) {
		me.attrs[attr] = element.getAttribute(attr);
	}
	
	/*—————— Childs ——————*/
	if(me.hasChilds) {
		const childs = <HTMLElement[]>Array.from(element.childNodes);
		
		for(const child of childs) {
			try { me.addChild(child) } catch{}
		}
		
	}

	return me;
}
