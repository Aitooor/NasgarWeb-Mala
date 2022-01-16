import { getElementFromJSON, } from "../common/html.js";
export class Pagination {
    constructor(options) {
        this.options = Object.assign({
            data: [],
            page: 0,
            pageSize: 10,
            maxButtons: 10,
            classes: {
                page: "page",
                dots: "dots",
                selected: "selected",
                disabled: "disabled",
            },
        }, options);
        this.data = this.options.data;
        this._render();
        this.options.elements.prev.addEventListener("click", () => {
            this.prev();
        });
        this.options.elements.next.addEventListener("click", () => {
            this.next();
        });
    }
    prev() {
        var _a, _b;
        if (this.options.page > 0) {
            (_b = (_a = this.options).onPageChange) === null || _b === void 0 ? void 0 : _b.call(_a, this.options.page - 1);
        }
    }
    next() {
        var _a, _b;
        if (this.options.page < this.getPageCount() - 1) {
            (_b = (_a = this.options).onPageChange) === null || _b === void 0 ? void 0 : _b.call(_a, this.options.page + 1);
        }
    }
    _render() {
        const { elements: { prev, next, list }, page, pageSize, maxButtons, classes, } = this.options;
        const data = this.data;
        const start = page * pageSize;
        const end = start + pageSize;
        const pages = this.getPageCount();
        const buttons = Math.min(pages, maxButtons);
        const pagesList = [];
        for (let i = 0; i < buttons; i++) {
            const elm = getElementFromJSON({
                elm: "button",
                classes: [classes.page, i === page ? classes.selected : ""],
                attrs: {
                    "data-page": i.toString(),
                },
                childs: [`${i + 1}`],
            });
            elm.events.add("click", () => {
                var _a, _b;
                (_b = (_a = this.options).onPageChange) === null || _b === void 0 ? void 0 : _b.call(_a, i);
            });
            pagesList.push(elm.dom);
        }
        list.innerHTML = "";
        list.append(...pagesList);
        if (page === 0) {
            prev.classList.add(classes.disabled);
            prev.setAttribute("disabled", "true");
        }
        else {
            prev.classList.remove(classes.disabled);
            prev.removeAttribute("disabled");
        }
        if (page === pages - 1) {
            next.classList.add(classes.disabled);
            next.setAttribute("disabled", "true");
        }
        else {
            next.classList.remove(classes.disabled);
            next.removeAttribute("disabled");
        }
    }
    setData(data) {
        this.data = data;
        this._render();
    }
    getPageData() {
        const start = this.options.page * this.options.pageSize;
        const end = start + this.options.pageSize;
        return this.data.slice(start, end);
    }
    setPage(page) {
        this.options.page = page;
        this._render();
    }
    getPageCount() {
        return Math.ceil(this.data.length / this.options.pageSize);
    }
}
//# sourceMappingURL=pagination.js.map