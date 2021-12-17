var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RecomendedSelectorList_instances, _RecomendedSelectorList_RegExp, _RecomendedSelectorList__init;
import Fuse from "../../../vendor/fusejs/fuse.js";
import { getCache, setCache } from "../../common/cache.js";
import { getElementFromJSON, getElementFromString, structureCopy, } from "../../common/html.js";
const templateHtml = `
<div class="selector-list">
  <div class="selector-list__header hidden" data-name="header">
    <input type="text"/>
  </div>
  <div class="selector-list__body">
    <div class="selector-list__hint"></div>
    <div class="selector-list__selectors"></div>
    <div class="selector-list__list" data-name="list"></div>
  </div>
</div>`;
let parent = getCache("selector-list-parent", null);
if (!parent) {
    parent = document.createElement("div");
    parent.className = "selector-list-parent";
    document.body.appendChild(parent);
    setCache("selector-list-parent", parent);
}
const defaultOptions = {
    list: [],
    properties: [],
    hint: "",
    target: document.querySelector("body"),
    useOnInput: false,
    onSelect: () => { },
    onClose: () => { },
};
export class RecomendedSelectorList {
    constructor(options) {
        _RecomendedSelectorList_instances.add(this);
        this.fuseByProperty = {};
        this.selectors = {};
        this._actualIndex = 0;
        this.isOpen = false;
        this.options = Object.assign(Object.assign({}, defaultOptions), (options || {}));
        this.options.properties = this.options.properties.map((property) => {
            if (typeof property === "string")
                return property;
            return Object.assign(Object.assign({}, property), { regex: __classPrivateFieldGet(this, _RecomendedSelectorList_instances, "m", _RecomendedSelectorList_RegExp).call(this, property.regex), visible: property.visible === undefined ? true : property.visible });
        });
        __classPrivateFieldGet(this, _RecomendedSelectorList_instances, "m", _RecomendedSelectorList__init).call(this);
    }
    _normalizeProperty(property) {
        if (typeof property === "string") {
            return {
                style: "fit",
                target: property,
                text: property,
                visible: true,
            };
        }
        return property;
    }
    _createSelector(property) {
        const prop = this._normalizeProperty(property);
        const selector = getElementFromJSON({
            elm: "div",
            classes: ["selector-list__selector", prop.style],
            childs: [prop.text],
        });
        this.selectors[prop.target] = selector;
        return selector;
    }
    _reloadSelectors() {
        const selectors = this.structure.childs[1].childs[1];
        selectors.dom.innerHTML = "";
        selectors.childs.splice(0, selectors.childs.length);
        this.options.properties.forEach((property) => {
            if (typeof property !== "string" && !property.visible) {
                return;
            }
            const selector = this._createSelector(property);
            selectors.addChild(selector.dom);
            return selector;
        });
    }
    _createListItem(item) {
        const listItem = getElementFromJSON({
            elm: "div",
            classes: ["selector-list-item"],
            childs: this.options.properties
                .map((property) => {
                const prop = this._normalizeProperty(property);
                if (prop.visible === false) {
                    return null;
                }
                return {
                    elm: "div",
                    classes: [
                        "selector-list-item__column",
                        prop.style === "fit" ? "" : prop.style,
                    ],
                    attrs: prop.style !== "fit"
                        ? {}
                        : {
                            style: `width: ${this.selectors[prop.target].dom.clientWidth}px`,
                        },
                    childs: [item[prop.target] + ""],
                };
            })
                .filter((item) => item !== null),
        });
        listItem.events.add("click", () => {
            this.options.onSelect(item, this._actualIndex);
            this.close();
        });
        return listItem;
    }
    _setPos(e) {
        const x = e.pageX;
        const y = e.pageY;
        this.element.style.top = `${y - window.scrollY}px`;
        this.element.style.left = `${x - window.scrollX}px`;
    }
    _loadData(data) {
        const list = this.structure.childs[1].childs[2];
        list.dom.innerHTML = "";
        list.childs.splice(0, list.childs.length);
        data.forEach((item) => {
            const listItem = this._createListItem(item);
            list.addChild(listItem.dom);
            return listItem;
        });
    }
    setHint(hint) {
        if (hint.length === 0) {
            this.structure.childs[1].childs[0].classes.add("hidden");
            return;
        }
        this.structure.childs[1].childs[0].classes.remove("hidden");
        this.structure.childs[1].childs[0].dom.innerHTML = hint;
    }
    setList(list) {
        this.options.list = list;
        this.fuse = new Fuse(this.options.list, {
            keys: this.options.properties.map((property) => {
                if (typeof property === "string")
                    return property;
                return property.target;
            }),
            isCaseSensitive: false,
            includeScore: false,
            shouldSort: true,
            threshold: 0.3,
        });
        this.fuseByProperty = {};
        this.options.properties.forEach((property) => {
            if (typeof property === "string")
                return;
            this.fuseByProperty[property.target] = new Fuse(this.options.list, {
                keys: [property.target],
                isCaseSensitive: false,
                includeScore: false,
                shouldSort: true,
                threshold: 0.3,
            });
        });
        this.refresh();
    }
    setTarget(_target) {
        let targets = Array.isArray(_target) ? _target : [_target];
        for (const [i, target] of targets.entries()) {
            if (this.options.useOnInput) {
                if (target.tagName !== "INPUT") {
                    throw new Error("Target must be an input element");
                }
                target.addEventListener("click", (e) => {
                    this._open(e);
                    this._actualIndex = i;
                    this.search(target.value);
                });
                target.addEventListener("blur", () => {
                    this.close();
                });
            }
            target.addEventListener("input", () => {
                this.search(target.value);
            });
        }
        this.options.target = targets;
    }
    setOnSelect(onSelect) {
        this.options.onSelect = onSelect;
    }
    refresh() {
        this._loadData(this.options.list);
    }
    _open(event) {
        if (this.isOpen)
            return;
        this.isOpen = true;
        this.inputCard.dom.value = "";
        this.structure.classes.add("active");
        this._setPos(event);
    }
    close() {
        this.isOpen = false;
        this.structure.classes.remove("active");
        this.options.onClose();
    }
    search(query) {
        this.inputCard.dom.value = query;
        if (query.length === 0) {
            this.refresh();
            return;
        }
        let results = null;
        this.options.properties.forEach((property) => {
            if (typeof property === "string")
                return;
            if (property.regex && __classPrivateFieldGet(this, _RecomendedSelectorList_instances, "m", _RecomendedSelectorList_RegExp).call(this, property.regex).test(query)) {
                results = this.fuseByProperty[property.target].search(query);
            }
        });
        if (!results) {
            results = this.fuse.search(query);
        }
        this._loadData(results.map((_) => _.item));
    }
}
_RecomendedSelectorList_instances = new WeakSet(), _RecomendedSelectorList_RegExp = function _RecomendedSelectorList_RegExp(regex) {
    if (typeof regex === "string") {
        return new RegExp(regex);
    }
    return regex;
}, _RecomendedSelectorList__init = function _RecomendedSelectorList__init() {
    this.element = getElementFromString(templateHtml);
    this.structure = structureCopy(this.element);
    this.structure.classes.remove("active");
    this.inputCard = (this.structure.childs[0].childs[0]);
    this.setList(this.options.list);
    this.setHint(this.options.hint || "");
    if (this.options.target) {
        this.setTarget(this.options.target);
    }
    this.inputCard.events.add("input", () => {
        this.search(this.inputCard.dom.value);
    });
    this.inputCard.events.add("blur", (e) => {
        this.close();
    });
    parent.appendChild(this.element);
    this._reloadSelectors();
    this.refresh();
};
//# sourceMappingURL=selectorList.js.map