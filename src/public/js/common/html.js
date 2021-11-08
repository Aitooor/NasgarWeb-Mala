export function query(str, parent = document) {
    return parent.querySelector(str);
}
export function queryAll(str, parent = document) {
    return Array.from(parent.querySelectorAll(str));
}
export function createElement(tag) {
    return document.createElement(tag);
}
export function middlewareEvents(element) {
    const original_a = element.addEventListener;
    const original_r = element.removeEventListener;
    let eventNames = [];
    const events = {};
    element.addEventListener = function (...args) {
        const name = args[0];
        const listener = args[1];
        if (events[name] == null)
            events[name] = [];
        if (!events[name].includes(listener))
            events[name].push(listener);
        eventNames = Object.keys(events);
        original_a.call(element, ...args);
    };
    element.removeEventListener = function (...args) {
        const name = args[0];
        const listener = args[1];
        if (events[name] == null)
            events[name] = [];
        events[name].filter(_ => _ !== listener);
        if (events[name].length === 0)
            events[name] = undefined;
        eventNames = Object.keys(events);
        original_r.call(element, ...args);
    };
    return {
        removeAll() {
            for (const ev of eventNames)
                for (const fn of events[ev])
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
export function structureCopy(element) {
    const me = {
        dom: element,
        elm: element.nodeName.toLowerCase(),
        classes: element.classList,
        attrs: {},
        events: middlewareEvents(element),
        hasChilds: element.hasChildNodes(),
        childs: [],
        _: {},
        addChild() { }
    };
    me.addChild = function (child) {
        if (child.nodeName === "#text") {
            throw new TypeError("Child is a text");
        }
        const tag = child.nodeName.toLowerCase();
        const name = child.dataset.name || null;
        const prop = name || tag;
        const sameTags = Object.keys(me._).filter(_ => _.match(new RegExp(`^${prop}\d*$`)) !== null);
        const structure = structureCopy(child);
        me._[prop + (sameTags.length || "")] = structure;
        me.childs.push(structure);
        return structure;
    };
    const attributeNames = element.getAttributeNames();
    for (const attr of attributeNames) {
        me.attrs[attr] = element.getAttribute(attr);
    }
    if (me.hasChilds) {
        const childs = Array.from(element.childNodes);
        for (const child of childs) {
            try {
                me.addChild(child);
            }
            catch (_a) { }
        }
    }
    return me;
}
//# sourceMappingURL=html.js.map