var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ElementList from "../../../components/list/list.js";
import { wait, } from "../../../common/shop.js";
import { query as querySelector } from "../../../common/html.js";
const header_actions_div = querySelector(".app .header .actions");
const categories_list = querySelector(".app .categories");
const category_template = querySelector("template#category");
const category_list = new ElementList(categories_list, "/api/shop/categories", { idTarget: "uuid" }).setTemplate(category_template.content.firstChild);
const header_action = {
    refresh: querySelector(".refresh", header_actions_div),
    filter: querySelector(".filter", header_actions_div),
    add: querySelector(".add", header_actions_div),
};
const refreshAction_fn = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([wait(1000), category_list.refresh()]);
});
header_action.refresh.onclick = refreshAction_fn;
category_list.on("refresh", (_this, mode) => {
    if (mode) {
        header_action.refresh.classList.add("anim");
    }
    else {
        header_action.refresh.classList.remove("anim");
    }
});
let filterAction_isRunning = false;
header_action.filter.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (filterAction_isRunning)
        return;
    filterAction_isRunning = true;
    header_action.filter.classList.add("anim");
    yield wait(500);
    alert("Not implemented");
    header_action.filter.classList.remove("anim");
    filterAction_isRunning = false;
});
let addAction_isRunning = false;
header_action.add.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (addAction_isRunning)
        return;
    addAction_isRunning = true;
    header_action.add.classList.add("anim");
    yield wait(500);
    header_action.add.classList.remove("anim");
    addAction_isRunning = false;
});
refreshAction_fn().catch(alert);
function* ArrayIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield [arr[i], i];
    }
}
//# sourceMappingURL=categories.js.map