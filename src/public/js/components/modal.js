import * as cache from "../common/cache.js";
import { EventEmitter } from "../common/events.js";
var c_pre = "modal_";
var c_hasParent = c_pre + "hasParent";
var c_parent = c_pre + "parent";
var hasParent = cache.getCache(c_hasParent, false);
var parent = cache.getCache(c_parent, document.createElement("div"));
if (!hasParent) {
    document.body.append(parent);
    cache.setCache(c_hasParent, true);
    cache.setCache(c_parent, parent);
}
var _Modal;
(function (_Modal) {
    var HeaderStyle;
    (function (HeaderStyle) {
        HeaderStyle[HeaderStyle["Solid"] = 0] = "Solid";
        HeaderStyle[HeaderStyle["Outline"] = 1] = "Outline";
    })(HeaderStyle = _Modal.HeaderStyle || (_Modal.HeaderStyle = {}));
    _Modal.HeaderStyleMap = Object.keys(HeaderStyle).map(function (_) { return _.toLowerCase(); });
})(_Modal || (_Modal = {}));
var Modal = /** @class */ (function () {
    function Modal(config) {
        this.config = {
            title: "",
            body: "",
            events: {
                onOpen: function () { },
                onClose: function () { }
            },
            actions: [{
                    name: "close",
                    onClick: function (modal) { modal.close(); }
                }]
        };
        this._events = new EventEmitter(["open", "close"]);
        this.element = null;
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
    Modal.prototype.open = function () {
        this._events.emit("open", [this]);
    };
    Modal.prototype.close = function () {
        this._events.emit("close", [this]);
    };
    Modal.prototype.on = function (ev, listener) {
        this._events.on(ev, listener);
    };
    Modal.prototype.setHeader = function (title, style) {
        this._header.innerHTML = title;
        if (style) {
            this._header.className = "modal-header " + _Modal.HeaderStyleMap[style];
        }
    };
    Modal.prototype.setBody = function (body) {
    };
    Modal.prototype.setConfig = function (config) {
        if (config.title)
            0;
        if (config.body)
            this.setBody(config.body);
        if (config.events) {
        }
    };
    Modal.parent = parent;
    Modal.HeaderStyle = _Modal.HeaderStyle;
    return Modal;
}());
export { Modal };
//# sourceMappingURL=modal.js.map