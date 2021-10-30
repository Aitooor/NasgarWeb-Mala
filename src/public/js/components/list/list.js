var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "../../common/events.js";
import { queryAll } from "../../common/html.js";
const DefaultElementList_Options = {
    idTarget: "uuid"
};
export class ElementList {
    constructor(parent, url, options = DefaultElementList_Options) {
        this.parent = parent;
        this.url = url;
        this.data = [];
        this.cache = {};
        this.template = null;
        this._isLoading = false;
        this._events = new EventEmitter(["refresh", "refresh", "render"]);
        this.options = Object.assign({}, DefaultElementList_Options, options);
    }
    setTemplate(template) {
        if (typeof template === "string") {
            const temp = document.createElement("div");
            temp.innerHTML = template;
            this.template = temp.firstChild;
        }
        else {
            this.template = template.cloneNode(true);
        }
        return this;
    }
    getTemplate() { return this.template; }
    getData() { return this.data.slice(0); }
    getCache() { return Object.assign({}, this.cache); }
    on(name, listener) {
        this._events.on(name, listener);
        return this;
    }
    _renderElement(data) {
        if (this.template === null) {
            throw new ReferenceError("`template` is not defined.");
        }
        const elm = this.template.cloneNode();
        const allElementsWithSlot = queryAll("*[slot]", elm);
        for (const elmWithSlot of allElementsWithSlot) {
            const slot = elmWithSlot.getAttribute("slot");
            elm.innerHTML = getFromProperty(data, slot);
        }
        return elm;
    }
    _render() {
        if (this.template === null) {
            throw new ReferenceError("`template` is not defined.");
        }
        const elms = [];
        for (const oneData of this.data) {
            elms.push(this._renderElement(oneData));
        }
        return elms;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isLoading)
                return;
            this._isLoading = true;
            this._events.emit("refresh", [this, true]);
            this.parent.classList.add("loading");
            this.parent.innerHTML = "Loading...";
            yield this.refreshData();
            const elements = this._render();
            this.parent.append(...elements);
            this.parent.classList.remove("loading");
            this._events.emit("refresh", [this, false]);
            this._isLoading = false;
        });
    }
    refreshData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "no-cache"
            });
            if (!response.ok) {
                alert(`Error fetching data to '${this.url}'.`);
                return null;
            }
            const json = yield response.json();
            this.data = json;
            this.cache = this.data.reduce((prev, acc) => {
                prev[acc[this.options.idTarget]] = acc;
                return prev;
            }, {});
            console.log(this.data, this.cache);
            return this.data;
        });
    }
}
export default ElementList;
function getFromProperty(obj, propStr) {
    const props = propStr.split(".");
    let last = obj;
    for (const prop of props) {
        if (typeof last === "undefined")
            throw new ReferenceError(`Property doesn't exists.`);
        last = last[prop];
    }
    return last;
}
//# sourceMappingURL=list.js.map