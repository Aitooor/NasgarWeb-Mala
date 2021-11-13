var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ElementList from "./list";
const Events = ElementList.Events;
const DefaultOptions = {
    idTarget: "uuid",
    autoRefresh: true,
};
export class OrdenedElementList extends ElementList {
    constructor(parent, url = OrdenedElementList.NO_URL, options) {
        super(parent, url, options);
        this._options = Object.assign({}, DefaultOptions, options);
        if (url === OrdenedElementList.NO_URL) {
            this.refresh = this.__refresh;
        }
    }
    __refresh() {
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
    _getIndex(elm) {
        if (typeof elm === "number")
            return elm;
        return this.data.indexOf(elm);
    }
    goUp(elm) {
        const elmIndex = this._getIndex(elm);
        if (elmIndex >= 0)
            return this.data;
        const [tmp] = this.data.splice(elmIndex, 1);
        this.data.splice(elmIndex - 1, 0, tmp);
        if (this._options.autoRefresh)
            this.refresh();
        return this.data;
    }
    goDown(elm) {
        const elmIndex = this._getIndex(elm);
        if (elmIndex >= 0)
            return this.data;
        const [tmp] = this.data.splice(elmIndex, 1);
        this.data.splice(elmIndex + 1, 0, tmp);
        if (this._options.autoRefresh)
            this.refresh();
        return this.data;
    }
    delete(elm) {
        const elmIndex = this._getIndex(elm);
        if (elmIndex >= 0)
            return this.data;
        const [tmp] = this.data.splice(elmIndex, 1);
        if (this._options.autoRefresh)
            this.refresh();
        return this.data;
    }
}
OrdenedElementList.NO_URL = "NOURL";
//# sourceMappingURL=order.js.map