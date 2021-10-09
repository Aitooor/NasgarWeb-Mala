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
    parent.classList.add("modal-parent");
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
        this._actions_json = structureCopy(this._actions);
        this.element.append(this._header, this._body, this._actions);
        Modal.parent.append(this.element);
        this.setConfig(config);
        Modal.allModals.push(this);
    }
    get isOpen() {
        return this.element.classList.contains("active");
    }
    set isOpen(value) {
        if (value)
            this.open();
        else
            this.close();
    }
    open() {
        this.element.classList.add("active");
        Modal.parent.classList.add("active");
        this._events.emit("open", [this]);
    }
    close() {
        this.element.classList.remove("active");
        if (!Modal.allModals.some(_ => _.isOpen))
            Modal.parent.classList.remove("active");
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
    disableAction(id) {
        var _a, _b, _c;
        if (typeof id === "number") {
            this._actions_json.childs[id].classes.add("disable");
        }
        (_c = (_b = (_a = this._actions_json._[id]) === null || _a === void 0 ? void 0 : _a.classes) === null || _b === void 0 ? void 0 : _b.add) === null || _c === void 0 ? void 0 : _c.call(_b, "disable");
    }
    disableActions() {
        for (let actionName in this._actions_json._)
            this._actions_json._[actionName].classes.add("disabled");
    }
    undisableAction(id) {
        var _a, _b, _c, _d, _e, _f;
        if (typeof id === "number") {
            (_c = (_b = (_a = this._actions_json.childs[id]) === null || _a === void 0 ? void 0 : _a.classes) === null || _b === void 0 ? void 0 : _b.remove) === null || _c === void 0 ? void 0 : _c.call(_b, "disable");
        }
        (_f = (_e = (_d = this._actions_json._[id]) === null || _d === void 0 ? void 0 : _d.classes) === null || _e === void 0 ? void 0 : _e.remove) === null || _f === void 0 ? void 0 : _f.call(_e, "disable");
    }
    undisableActions() {
        for (let actionName in this._actions_json._)
            this._actions_json._[actionName].classes.remove("disabled");
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
        btn.dataset.name = action.name;
        btn.className = (_a = action.className) !== null && _a !== void 0 ? _a : "";
        btn.classList.add(_Modal.ActionColor[(_b = action.color) !== null && _b !== void 0 ? _b : 0].toLowerCase());
        const btn_json = this._actions_json.addChild(btn);
        btn_json.events.add("click", action.onClick.bind(this, this));
        this._actions.append(btn);
    }
    /*-********* Get Modal parts *********-*/
    getActions() {
        return this._actions_json;
    }
    getActionsConfig() {
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
                // Prevent hidden body
                clone.classes.remove("hidden");
                clone.dom.removeAttribute("hidden");
                this.element.replaceChild(clone.dom, this._body);
                this._body = clone.dom;
                this._body_json = clone;
            }
            else {
            }
        }
    }
    setActions(actions) {
        this.config.actions = [];
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
        if (config.actions) {
            this.setActions(config.actions);
        }
    }
}
Modal.parent = parent;
Modal.HeaderStyle = _Modal.HeaderStyle;
Modal.ActionColor = _Modal.ActionColor;
Modal.allModals = [];
//# sourceMappingURL=modal.js.map