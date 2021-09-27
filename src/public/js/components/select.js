export default class Select {
    /**
     * @example
     * const select = new Select({ ... });
     */
    constructor(options) {
        var _a;
        this.element = options.dom;
        this.setOptions(options.options);
        this.select((_a = options.selected) !== null && _a !== void 0 ? _a : 0);
        this.addEventListener = options.dom.addEventListener.bind(options.dom);
        this.removeEventListener = options.dom.removeEventListener.bind(options.dom);
    }
    addEventListener(type, listener) { }
    removeEventListener(type, listener) { }
    select(id) {
        if (typeof id === "number") {
            this.element.selectedIndex = id;
        }
        else {
            this.element.selectedIndex = Math.max(0, this.options.indexOf(id));
        }
    }
    setOptions(options) {
        this.element.innerHTML = "";
        this.options = options;
        for (const option of options) {
            const dom = document.createElement("option");
            dom.innerHTML = option;
            dom.value = option;
            this.element.append(dom);
        }
    }
    get selectedIndex() {
        return this.element.selectedIndex;
    }
    get selectedValue() {
        return this.options[this.element.selectedIndex];
    }
}
//# sourceMappingURL=select.js.map