import * as cache from "../common/cache.js";
import { structureCopy } from "../common/html.js";
import { EventEmitter } from "../common/events.js";
const c_pre = "modal_";
const c_hasParent = c_pre + "hasParent";
const c_parent = c_pre + "parent";
const hasParent = cache.getCache(c_hasParent, false);
const parent = cache.getCache(c_parent, document.createElement("div"));
if (!hasParent) {
    document.body.append(parent);
    cache.setCache(c_hasParent, true);
    cache.setCache(c_parent, parent);
}
export var _Modal;
(function (_Modal) {
    let HeaderStyle;
    (function (HeaderStyle) {
        HeaderStyle[HeaderStyle["Solid"] = 0] = "Solid";
        HeaderStyle[HeaderStyle["Outline"] = 1] = "Outline";
    })(HeaderStyle = _Modal.HeaderStyle || (_Modal.HeaderStyle = {}));
    let ActionColor;
    (function (ActionColor) {
        ActionColor[ActionColor["Primary"] = 0] = "Primary";
        ActionColor[ActionColor["Secondary"] = 1] = "Secondary";
        ActionColor[ActionColor["Info"] = 2] = "Info";
        ActionColor[ActionColor["Danger"] = 3] = "Danger";
        ActionColor[ActionColor["Warning"] = 4] = "Warning";
    })(ActionColor = _Modal.ActionColor || (_Modal.ActionColor = {}));
})(_Modal || (_Modal = {}));
export default class Modal {
    constructor(config) {
        this.config = {
            title: "",
            headerStyle: _Modal.HeaderStyle.Solid,
            body: "",
            cloneBody: true,
            events: {
                onOpen: () => { },
                onClose: () => { }
            },
            actions: [{
                    name: "close",
                    onClick: (modal) => { modal.close(); }
                }]
        };
        this._events = new EventEmitter(["open", "close"]);
        this._body_json = null;
        this.element = document.createElement("div");
        this._header = document.createElement("div");
        this._body = document.createElement("div");
        this._actions = document.createElement("div");
        this.element.className = "modal";
        this._header.className = "modal-header";
        this._body.className = "modal-body";
        this._actions.className = "modal-actions";
        this.element.append(this._header, this._body, this._actions);
        Modal.parent.append(this.element);
        this.setConfig(config);
    }
    open() {
        this.element.classList.add("active");
        this._events.emit("open", [this]);
    }
    close() {
        this.element.classList.remove("active");
        this._events.emit("close", [this]);
    }
    /**
     * Just use when `config.cloneBody` is `true`.
     */
    drainEvents() {
        if (!this.config.cloneBody)
            return;
        function deep(elm) {
            elm.events.removeAll();
            for (const child of elm.childs)
                deep(child);
        }
        deep(this._body_json);
    }
    /*-********* Events *********-*/
    on(ev, listener) {
        this._events.on(ev, listener);
    }
    off(ev, listener) {
        this._events.off(ev, listener);
    }
    /*-********* Add Modal parts *********-*/
    addAction(action) {
        var _a, _b;
        this.config.actions.push(action);
        const btn = document.createElement("button");
        btn.innerHTML = action.name;
        btn.className = (_a = action.className) !== null && _a !== void 0 ? _a : "";
        btn.classList.add(_Modal.ActionColor[(_b = action.color) !== null && _b !== void 0 ? _b : 0].toLowerCase());
    }
    /*-********* Get Modal parts *********-*/
    getActions() {
        return this.config.actions.slice(0);
    }
    getBodyDom() {
        return this._body;
    }
    getBody() {
        return this._body_json;
    }
    getHeader() {
        return {
            dom: this._header,
            title: this.config.title,
            style: this.config.headerStyle
        };
    }
    /*-********* Set Modal parts *********-*/
    setHeader(title, style) {
        if (title)
            this._header.innerHTML = title;
        if (style)
            this._header.className = "modal-header " + _Modal.HeaderStyle[style].toLowerCase();
    }
    setBody(body) {
        if (typeof body === "string") {
        }
        else {
            if (this.config.cloneBody) {
                const clone = structureCopy(body);
                clone.classes.add("modal-body");
                this._body = clone.dom;
                this._body_json = clone;
            }
            else {
            }
        }
    }
    setActions(actions) {
        for (const action of actions)
            this.addAction(action);
    }
    setConfig(config) {
        var _a, _b, _c, _d;
        this.setHeader((_a = config.title) !== null && _a !== void 0 ? _a : this.config.title, (_b = config.headerStyle) !== null && _b !== void 0 ? _b : this.config.headerStyle);
        this.config.cloneBody = (_c = config.cloneBody) !== null && _c !== void 0 ? _c : this.config.cloneBody;
        this.setBody((_d = config.body) !== null && _d !== void 0 ? _d : this.config.body);
        if (config.events) {
            if (config.events.onOpen)
                this.on("open", config.events.onOpen);
            if (config.events.onClose)
                this.on("close", config.events.onClose);
        }
    }
}
Modal.parent = parent;
Modal.HeaderStyle = _Modal.HeaderStyle;
Modal.ActionColor = _Modal.ActionColor;
//# sourceMappingURL=modal.js.map