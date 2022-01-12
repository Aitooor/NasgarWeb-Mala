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
import { queryAll } from "../../../common/html.js";
import { wait } from "../../../common/shop.js";
import { RecomendedSelectorList } from "../../../components/selector_list/selectorList.js";
import { query as querySelector } from "../../../common/html.js";
import { OrdenedElementList } from "../../../components/list/order.js";
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
let cacheProducts;
const header_actions_div = querySelector(".app .header .actions");
const categories_list = querySelector(".app .categories");
const category_template = querySelector("template#category");
const category_list = new ElementList(categories_list, "/api/shop/categories", { idTarget: "uuid" })
    .setOrderByFunction((a, b) => {
    return a.name.localeCompare(b.name);
})
    .setTemplate(category_template.content.firstElementChild)
    .setOnClick((_, elm, data) => {
    OpenCategoryModal(data);
});
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
refreshAction_fn();
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
    options: Object.keys(UserRank).filter((_) => typeof UserRank[_] === "number"),
});
const productsList = new OrdenedElementList(document.querySelector("#product_list"), OrdenedElementList.NO_URL, {
    autoRefresh: true,
    idTarget: "uuid",
}).setCustomFunctions({
    inputFn: (ctx) => {
        var _a;
        const inpZone = querySelector(".input-zone", ctx.template);
        const name = querySelector(".name", inpZone);
        const value = ctx.element.value;
        if (value.length > 0) {
            inpZone.classList.remove("blank");
            if (value.length !== 36) {
                name.innerText = "Invalid";
            }
            else {
                name.innerText =
                    ((_a = cacheProducts.find((_) => _.uuid === value)) === null || _a === void 0 ? void 0 : _a.name) ||
                        "Invalid";
            }
        }
        else {
            inpZone.classList.add("blank");
        }
        const index = ctx.list.getIndex(ctx.data);
        if (index !== -1 &&
            cacheProducts.find((_) => _.uuid === value) !== undefined) {
            ctx.data.uuid = value;
        }
        else {
            ctx.data.uuid = "";
        }
        ctx.usePipe("custom:change");
    },
}).setTemplate(`
<div class="item" >
  <div class="input-zone">
    <input type="text" data-slot-events="input" data-oninput="this.custom.inputFn(this);" slot="uuid" placeholder="uuid">
    <div class="name" slot="name"></div>
  </div>
  <button class="delete" >
    <i class="material" data-slot-events="click" data-onclick="this.fn.delete(); this.usePipe('custom:change');">delete</i> 
  </button>
  <div class="ord-btns">
    <button class="up" data-slot-events="click" data-onclick="this.fn.goUp(); this.usePipe('custom:change');"><i class="material">keyboard_arrow_up</i></button>
    <button class="down" data-slot-events="click" data-onclick="this.fn.goDown(); this.usePipe('custom:change');"><i class="material">keyboard_arrow_down</i></button>
  </div>
</div>
`);
const productsListSelector = new RecomendedSelectorList({
    list: [],
    hint: "Use " +
        '<span class="text-style-code">' +
        '<span class="code-active">&</span><span class="code-comment">UUID</span>' +
        "</span>, " +
        '<span class="text-style-code">' +
        '<span class="code-active">@</span><span class="code-comment">Category</span>' +
        "</span>, " +
        '<span class="text-style-code">' +
        '<span class="code-active"></span><span class="code-comment">Name</span>' +
        "</span> or " +
        '<span class="text-style-code">' +
        '<span class="code-active">$</span><span class="code-comment">Price</span>' +
        "</span>",
    properties: [
        {
            target: "uuid",
            text: "UUID",
            style: "small",
            regex: /^&/,
            visible: false,
        },
        {
            text: "Category",
            target: "category",
            style: "fit",
            regex: /^@/,
        },
        {
            text: "Name",
            target: "name",
            style: "large",
        },
        {
            text: "Price",
            target: "price",
            style: "fit",
            regex: /^\$/,
        },
    ],
    target: [],
    useOnInput: true,
});
function SetOrderActions(order) {
    const addBtn = modalCategory.getBody()._.orders._.header._.actions._.button.dom;
    AddEvent("click", addBtn, () => {
        productsList.add({ uuid: "", name: "", category: "" });
        const childs = (Array.from(queryAll(".input-zone input", modalCategory.getBody()._.orders._.list.dom)));
        productsListSelector.setTarget(childs);
        productsListSelector.setOnSelect((item, i) => {
            childs[i].value = item.uuid;
            childs[i].dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        });
    });
    productsList.clearPipes();
    productsList.pipe((method) => {
        if (method !== "custom:change")
            return;
        order.splice(0, order.length);
        order.push(...productsList.getData().map((v) => v.uuid));
    });
}
function LoadProductsOnCategoryModal(actual) {
    productsList.deleteAll();
    for (let [product, i] of ArrayIndex(actual)) {
        const prod = cacheProducts.find((_) => _.uuid === product);
        const name = (prod === null || prod === void 0 ? void 0 : prod.name) || "";
        const category = (prod === null || prod === void 0 ? void 0 : prod.category) || "";
        productsList.add({ uuid: product, name: name, category: category });
        const childs = (Array.from(queryAll(".input-zone input", modalCategory.getBody()._.orders._.list.dom)));
        productsListSelector.setTarget(childs);
    }
}
const categoriesList = new OrdenedElementList(document.querySelector("#category_list"), OrdenedElementList.NO_URL, {
    autoRefresh: true,
    idTarget: "uuid",
}).setCustomFunctions({
    inputFn: (ctx) => {
        var _a;
        const inpZone = querySelector(".input-zone", ctx.template);
        const name = querySelector(".name", inpZone);
        const value = ctx.element.value;
        if (value.length > 0) {
            inpZone.classList.remove("blank");
            if (value.length !== 36) {
                name.innerText = "Invalid";
            }
            else {
                name.innerText =
                    ((_a = category_list.getData().find((_) => _.uuid === value)) === null || _a === void 0 ? void 0 : _a.name) || "Invalid";
            }
        }
        else {
            inpZone.classList.add("blank");
        }
        const index = ctx.list.getIndex(ctx.data);
        if (index !== -1 &&
            category_list.getData().find((_) => _.uuid === value) !==
                undefined) {
            ctx.data.uuid = value;
        }
        else {
            ctx.data.uuid = "";
        }
        ctx.usePipe("custom:change");
    },
}).setTemplate(`
<div class="item" >
  <div class="input-zone">
    <input type="text" data-slot-events="input" data-oninput="this.custom.inputFn(this);" slot="uuid" placeholder="uuid">
    <div class="name" slot="name"></div>
  </div>
  <button class="delete" >
    <i class="material" data-slot-events="click" data-onclick="this.fn.delete(); this.usePipe('custom:change');">delete</i> 
  </button>
  <div class="ord-btns">
    <button class="up" data-slot-events="click" data-onclick="this.fn.goUp(); this.usePipe('custom:change');"><i class="material">keyboard_arrow_up</i></button>
    <button class="down" data-slot-events="click" data-onclick="this.fn.goDown(); this.usePipe('custom:change');"><i class="material">keyboard_arrow_down</i></button>
  </div>
</div>
`);
const categoriesListSelector = new RecomendedSelectorList({
    list: [],
    hint: "Use " +
        '<span class="text-style-code">' +
        '<span class="code-active"></span><span class="code-comment">Name</span>' +
        "</span>",
    properties: [
        {
            target: "uuid",
            text: "UUID",
            style: "small",
            regex: /^&/,
            visible: false,
        },
        {
            text: "Name",
            target: "name",
            style: "large",
        },
    ],
    target: [],
    useOnInput: true,
});
function SetOrderCategories(order) {
    const addBtn = modalCategory.getBody()._.categories._.header._.actions._.button.dom;
    categoriesListSelector.setList(category_list.getData());
    AddEvent("click", addBtn, () => {
        categoriesList.add({ uuid: "", name: "" });
        const childs = (Array.from(queryAll(".input-zone input", modalCategory.getBody()._.categories._.list.dom)));
        categoriesListSelector.setTarget(childs);
        categoriesListSelector.setOnSelect((item, i) => {
            console.log(item);
            childs[i].value = item.uuid;
            childs[i].dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        });
    });
    categoriesList.clearPipes();
    categoriesList.pipe((method) => {
        if (method !== "custom:change")
            return;
        order.splice(0, order.length);
        order.push(...categoriesList.getData().map((v) => v.uuid));
    });
}
function LoadCategoriesOnCategoryModal(actual) {
    categoriesList.deleteAll();
    for (let [category, i] of ArrayIndex(actual)) {
        const prod = category_list
            .getData()
            .find((_) => _.uuid === category);
        const name = (prod === null || prod === void 0 ? void 0 : prod.name) || "";
        categoriesList.add({ uuid: category, name: name });
        const childs = (Array.from(queryAll(".input-zone input", modalCategory.getBody()._.categories._.list.dom)));
        categoriesListSelector.setTarget(childs);
    }
}
function UpdateData(property, elm, _default, pre) {
    elm.dom.value = _default;
    pre = pre || ((_) => _);
    property[0][property[1]] = pre(_default, elm);
    elm.events.add("input", () => {
        property[0][property[1]] = pre(elm.dom.value, elm);
    });
}
function UpdateDataSelect(property, elm, select, _default, pre) {
    pre = pre || ((_) => _);
    if (typeof _default !== "undefined") {
        select.select(_default);
    }
    property[0][property[1]] = pre(select.selectedValue, elm);
    elm.events.add("change", () => {
        property[0][property[1]] = pre(select.selectedValue, elm);
    });
}
function OpenAddModal() {
    const actual_category_data = {
        uuid: "",
        name: "",
        display: "{{NAME}}",
        description: "",
        image: "",
        min_rank: UserRank.Default,
        order: [],
        subcategories: [],
    };
    const actual_order = actual_category_data.order;
    const actual_subcategories = actual_category_data.subcategories;
    const body = modalCategory.getBody();
    modalCategory.setHeader("New Category");
    body._.uuid.classes.add("hidden");
    modalCategory.getActions()._.Delete.classes.add("hidden");
    UpdateData([actual_category_data, "name"], body._.name._.input, "");
    UpdateData([actual_category_data, "display"], body._.display._.input, "{{NAME}}");
    const updateDisplay = () => {
        body._.display._.preview.dom.innerHTML = (body._.display._.input.dom).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
    };
    body._.display._.input.events.add("input", updateDisplay);
    body._.name._.input.events.add("input", updateDisplay);
    updateDisplay();
    UpdateData([actual_category_data, "description"], body._.description._.textarea, "");
    UpdateDataSelect([actual_category_data, "min_rank"], body._.rank._.select, rankSelect, 0, (value) => UserRank[value]);
    SetOrderActions(actual_order);
    LoadProductsOnCategoryModal(actual_order);
    SetOrderCategories(actual_subcategories);
    LoadCategoriesOnCategoryModal(actual_subcategories);
    modalCategory_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
        modal.disableActions();
        modal.setHeader("New category [SAVING]");
        try {
            yield AddCategory({
                uuid: "",
                name: actual_category_data.name,
                display: actual_category_data.display,
                description: actual_category_data.description,
                image: actual_category_data.image,
                min_rank: actual_category_data.min_rank,
                order: actual_category_data.order,
                subcategories: actual_category_data.subcategories,
            });
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
function OpenCategoryModal(data) {
    const actual_category_data = JSON.parse(JSON.stringify(data));
    const actual_order = actual_category_data.order;
    const actual_subcategories = actual_category_data.subcategories;
    const body = modalCategory.getBody();
    modalCategory.setHeader(data.name);
    const uuid_s = body._.uuid;
    uuid_s.dom.innerHTML = "UUID: " + data.uuid;
    uuid_s.classes.remove("hidden");
    modalCategory.getActions()._.Delete.classes.remove("hidden");
    UpdateData([actual_category_data, "name"], body._.name._.input, actual_category_data.name);
    UpdateData([actual_category_data, "display"], body._.display._.input, actual_category_data.display);
    const updateDisplay = () => {
        body._.display._.preview.dom.innerHTML = (body._.display._.input.dom).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
    };
    body._.display._.input.events.add("input", updateDisplay);
    body._.name._.input.events.add("input", updateDisplay);
    updateDisplay();
    UpdateData([actual_category_data, "description"], body._.description._.textarea, actual_category_data.description);
    UpdateDataSelect([actual_category_data, "min_rank"], body._.rank._.select, rankSelect, actual_category_data.min_rank - 1, (value) => UserRank[value]);
    SetOrderActions(actual_order);
    LoadProductsOnCategoryModal(actual_order);
    SetOrderCategories(actual_subcategories);
    LoadCategoriesOnCategoryModal(actual_subcategories);
    modalCategory_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
        modal.disableActions();
        modal.setHeader(data.name + " [SAVING]");
        try {
            yield UpdateItem({
                uuid: actual_category_data.uuid,
                name: actual_category_data.name,
                display: actual_category_data.display,
                description: actual_category_data.description,
                image: actual_category_data.image,
                min_rank: actual_category_data.min_rank,
                order: actual_category_data.order,
                subcategories: actual_category_data.subcategories,
            });
        }
        catch (err) {
            alert(err);
            return;
        }
        yield refreshAction_fn();
        modal.undisableActions();
        modal.drainEvents();
        modal.close();
    });
    modalCategory_events._delete = (modal) => __awaiter(this, void 0, void 0, function* () {
        if (confirm("Are you sure?")) {
            if (yield RemItem(data.uuid, prompt('Write: "DELETE"'))) {
                modal.close();
                refreshAction_fn();
            }
        }
    });
    modalCategory.open();
}
function AddEvent(ev, elm, fn) {
    elm.addEventListener(ev, fn);
}
function* ArrayIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield [arr[i], i];
    }
}
function PrePostItem(data) {
    if (data.name.length > 20)
        throw new RangeError("Name is very long. Max 30.");
}
function UpdateItem(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        PrePostItem(data);
        const res = yield fetch("/api/shop/category", {
            method: "PUT",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (res.status === 500)
            return ((alert("Error updating product: " + ((_a = (yield res.json())) === null || _a === void 0 ? void 0 : _a.error)), true),
                false);
        return true;
    });
}
function AddCategory(data) {
    return __awaiter(this, void 0, void 0, function* () {
        PrePostItem(data);
        const res = yield fetch("/api/shop/category", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok)
            return alert("Error adding item."), false;
        return true;
    });
}
function RemItem(uuid, confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/shop/category", {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uuid,
                confirmation,
            }),
        });
        if (res.status === 400) {
            alert("Invalid confirmation.");
            return false;
        }
        if (!res.ok) {
            alert("Error deleting item.");
            return false;
        }
        return true;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("/api/get/products", {
        headers: {
            accept: "application/json",
        },
        credentials: "same-origin",
    });
    if (!res.ok)
        return;
    cacheProducts = yield res.json();
    productsListSelector.setList(cacheProducts);
}))();
//# sourceMappingURL=categories.js.map