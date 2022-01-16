var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ElementList } from "./list.js";
import { Pagination } from "../pagination.js";
export class ElementListPaginator extends ElementList {
    constructor(parent, url, options) {
        super(parent, url, options);
        this.pagination = new Pagination(Object.assign(Object.assign({}, options), { data: [], onPageChange: (page) => {
                this._execPipes("page:change", page);
            } }));
    }
    _render() {
        if (this.template === null) {
            throw new ReferenceError("`template` is not defined.");
        }
        const elms = [];
        this.pagination.setData(this.data);
        const pagedData = this.pagination.getPageData();
        for (const oneData of pagedData.sort(this.orderByFunction).slice()) {
            elms.push(this._renderElement(oneData));
        }
        return elms;
    }
    _reRender() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoading)
                return this.data;
            this.isLoading = true;
            this.parent.classList.remove("no-data");
            this.parent.classList.add("loading");
            this.parent.innerHTML = "Loading...";
            const elements = this._render();
            if (elements.length === 0) {
                this.parent.innerHTML = "No data";
                this.parent.classList.add("no-data");
            }
            else {
                this.parent.innerHTML = "";
                this.parent.append(...elements);
            }
            this.parent.classList.remove("loading");
            this.isLoading = false;
            return this.data;
        });
    }
    setPage(page) {
        this.pagination.setPage(page);
        this._reRender();
    }
}
//# sourceMappingURL=listPaginator.js.map