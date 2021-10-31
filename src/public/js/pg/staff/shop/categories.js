var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Modal from "../../../components/modal.js";
import Select from "../../../components/select.js";
import ElementList from "../../../components/list/list.js";
import { wait, } from "../../../common/shop.js";
import { query as querySelector } from "../../../common/html.js";
var UserRank;
(function (UserRank) {
    UserRank[UserRank["Default"] = 1] = "Default";
    UserRank[UserRank["User"] = 2] = "User";
    UserRank[UserRank["Partner"] = 3] = "Partner";
    UserRank[UserRank["Staff"] = 4] = "Staff";
    UserRank[UserRank["Builder"] = 5] = "Builder";
    UserRank[UserRank["Dev"] = 6] = "Dev";
    UserRank[UserRank["Soporte"] = 7] = "Soporte";
    UserRank[UserRank["Mod"] = 8] = "Mod";
    UserRank[UserRank["Admin"] = 9] = "Admin";
    UserRank[UserRank["Owner"] = 10] = "Owner";
})(UserRank || (UserRank = {}));
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
    if (category_list.isLoading)
        return;
    header_action.refresh.classList.add("anim");
    yield Promise.all([wait(1000), category_list.refresh()]);
    header_action.refresh.classList.remove("anim");
});
header_action.refresh.onclick = refreshAction_fn;
let filterAction_isRunning = false;
header_action.filter.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (filterAction_isRunning)
        return;
    filterAction_isRunning = true;
    header_action.filter.classList.add("anim");
    yield wait(1000);
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
    OpenAddModal();
    header_action.add.classList.remove("anim");
    addAction_isRunning = false;
});
refreshAction_fn().catch(alert);
const modalCategory_events = {
    _delete: (_) => { },
    _save: (_) => { },
};
const modalCategory_Vars = {};
const modalCategory_body = querySelector("#category-editor-body");
const modalCategory = new Modal({
    title: "Loading...",
    headerStyle: Modal.HeaderStyle.Solid,
    body: modalCategory_body,
    cloneBody: true,
    actions: [
        {
            name: "Delete",
            color: Modal.ActionColor.Danger,
            onClick: (modal) => {
                modalCategory_events._delete(modal);
            },
        },
        {
            name: "Cancel",
            onClick: (modal) => {
                modal.drainEvents();
                modal.close();
            },
        },
        {
            name: "Save",
            onClick: (modal) => {
                modalCategory_events._save(modal);
            },
        },
    ],
});
const rankSelect = new Select({
    dom: modalCategory.getBody()._.rank._.select.dom,
    options: Object.keys(UserRank).filter(_ => typeof UserRank[_] === "number")
});
console.log(rankSelect);
const tmCategoryListModal = (querySelector("template#list-category").content
    .firstElementChild);
function UpdateData(property, elm, _default, pre) {
    elm.dom.value = _default;
    pre = pre || ((_) => _);
    property[0][property[1]] = _default;
    elm.events.add("change", () => {
        property[0][property[1]] = pre(elm.dom.value);
    });
}
function UpdateDataSelect(property, elm, select, _default, pre) {
    pre = pre || ((_) => _);
    if (typeof _default !== "undefined") {
        select.select(_default);
    }
    property[0][property[1]] = pre(select.selectedValue);
    elm.events.add("change", () => {
        property[0][property[1]] = pre(select.selectedValue);
    });
}
function OpenAddModal() {
    const actual_category_data = {
        uuid: "",
        name: "",
        display: "",
        description: "",
        image: "",
        min_rank: UserRank.Default,
        order: [],
    };
    const actual_order = [];
    const body = modalCategory.getBody();
    modalCategory.setHeader("New Category");
    body._.uuid.classes.add("hidden");
    modalCategory.getActions()._.Delete.classes.add("hidden");
    UpdateData([actual_category_data, "name"], body._.name._.input, "");
    UpdateData([actual_category_data, "display"], body._.display._.input, "");
    UpdateData([actual_category_data, "description"], body._.description._.textarea, "");
    UpdateDataSelect([actual_category_data, "min_rank"], body._.rank._.select, rankSelect, 0, (value) => UserRank[value]);
    modalCategory_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
        modal.disableActions();
        modal.setHeader("New category [SAVING]");
        try {
            console.log(actual_category_data);
            alert("Not implemented");
        }
        catch (err) {
            alert(err);
            console.error(err);
            return;
        }
        yield refreshAction_fn();
        modal.undisableActions();
        modal.close();
        modal.drainEvents();
    });
    modalCategory.open();
}
function* ArrayIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield [arr[i], i];
    }
}
//# sourceMappingURL=categories.js.map