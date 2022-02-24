System.register(["../../../components/modal.js", "../../../components/select.js", "../../../components/list/list.js", "../../../common/html.js", "../../../common/shop.js", "../../../components/selector_list/selectorList.js", "../../../components/list/order.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var modal_js_1, select_js_1, list_js_1, html_js_1, shop_js_1, selectorList_js_1, html_js_2, order_js_1, SimpleMDE, UserRank, cacheProducts, header_actions_div, categories_list, category_template, category_list, header_action, refreshAction_fn, filterAction_isRunning, addAction_isRunning, modalCategory_events, modalCategory_Vars, modalCategory_body, modalCategory, updateMDE, rankSelect, productsList, productsListSelector, categoriesList, categoriesListSelector;
    var __moduleName = context_1 && context_1.id;
    function SetOrderActions(order) {
        const addBtn = modalCategory.getBody()._.orders._.header._.actions._.button.dom;
        AddEvent("click", addBtn, () => {
            productsList.add({ uuid: "", name: "", category: "" });
            const childs = (Array.from(html_js_1.queryAll(".input-zone input", modalCategory.getBody()._.orders._.list.dom)));
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
            const childs = (Array.from(html_js_1.queryAll(".input-zone input", modalCategory.getBody()._.orders._.list.dom)));
            productsListSelector.setTarget(childs);
        }
    }
    function SetOrderCategories(order) {
        const addBtn = modalCategory.getBody()._.categories._.header._.actions._.button.dom;
        categoriesListSelector.setList(category_list.getData());
        AddEvent("click", addBtn, () => {
            categoriesList.add({ uuid: "", name: "" });
            const childs = (Array.from(html_js_1.queryAll(".input-zone input", modalCategory.getBody()._.categories._.list.dom)));
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
            const childs = (Array.from(html_js_1.queryAll(".input-zone input", modalCategory.getBody()._.categories._.list.dom)));
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
        updateMDE.value(" ");
        UpdateData([actual_category_data, "name"], body._.name._.input, "");
        UpdateData([actual_category_data, "display"], body._.display._.input, "{{NAME}}");
        const updateDisplay = () => {
            body._.display._.preview.dom.innerHTML = (body._.display._.input.dom).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
        };
        body._.display._.input.events.add("input", updateDisplay);
        body._.name._.input.events.add("input", updateDisplay);
        updateDisplay();
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
                    description: updateMDE.value(),
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
        updateMDE.value(data.description);
        UpdateData([actual_category_data, "name"], body._.name._.input, actual_category_data.name);
        UpdateData([actual_category_data, "display"], body._.display._.input, actual_category_data.display);
        const updateDisplay = () => {
            body._.display._.preview.dom.innerHTML = (body._.display._.input.dom).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
        };
        body._.display._.input.events.add("input", updateDisplay);
        body._.name._.input.events.add("input", updateDisplay);
        updateDisplay();
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
    return {
        setters: [
            function (modal_js_1_1) {
                modal_js_1 = modal_js_1_1;
            },
            function (select_js_1_1) {
                select_js_1 = select_js_1_1;
            },
            function (list_js_1_1) {
                list_js_1 = list_js_1_1;
            },
            function (html_js_1_1) {
                html_js_1 = html_js_1_1;
                html_js_2 = html_js_1_1;
            },
            function (shop_js_1_1) {
                shop_js_1 = shop_js_1_1;
            },
            function (selectorList_js_1_1) {
                selectorList_js_1 = selectorList_js_1_1;
            },
            function (order_js_1_1) {
                order_js_1 = order_js_1_1;
            }
        ],
        execute: function () {
            SimpleMDE = window.SimpleMDE;
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
            header_actions_div = html_js_2.query(".app .header .actions");
            categories_list = html_js_2.query(".app .categories");
            category_template = html_js_2.query("template#category");
            category_list = new list_js_1.default(categories_list, "/api/shop/categories", { idTarget: "uuid" })
                .setOrderByFunction((a, b) => {
                return a.name.localeCompare(b.name);
            })
                .setTemplate(category_template.content.firstElementChild)
                .setOnClick((_, elm, data) => {
                OpenCategoryModal(data);
            });
            header_action = {
                refresh: html_js_2.query(".refresh", header_actions_div),
                filter: html_js_2.query(".filter", header_actions_div),
                add: html_js_2.query(".add", header_actions_div),
            };
            refreshAction_fn = () => __awaiter(void 0, void 0, void 0, function* () {
                if (category_list.isLoading)
                    return;
                header_action.refresh.classList.add("anim");
                yield Promise.all([shop_js_1.wait(1000), category_list.refresh()]);
                header_action.refresh.classList.remove("anim");
            });
            header_action.refresh.onclick = refreshAction_fn;
            filterAction_isRunning = false;
            header_action.filter.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                if (filterAction_isRunning)
                    return;
                filterAction_isRunning = true;
                header_action.filter.classList.add("anim");
                yield shop_js_1.wait(1000);
                alert("Not implemented");
                header_action.filter.classList.remove("anim");
                filterAction_isRunning = false;
            });
            addAction_isRunning = false;
            header_action.add.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                if (addAction_isRunning)
                    return;
                addAction_isRunning = true;
                header_action.add.classList.add("anim");
                yield shop_js_1.wait(500);
                OpenAddModal();
                header_action.add.classList.remove("anim");
                addAction_isRunning = false;
            });
            refreshAction_fn();
            modalCategory_events = {
                _delete: (_) => { },
                _save: (_) => { },
            };
            modalCategory_Vars = {};
            modalCategory_body = html_js_2.query("#category-editor-body");
            modalCategory = new modal_js_1.default({
                title: "Loading...",
                headerStyle: modal_js_1.default.HeaderStyle.Solid,
                body: modalCategory_body,
                cloneBody: true,
                actions: [
                    {
                        name: "Delete",
                        color: modal_js_1.default.ActionColor.Danger,
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
            updateMDE = new SimpleMDE({
                autoDownloadFontAwesome: false,
                spellChecker: false,
                element: html_js_2.query("#content"),
                toolbar: [
                    {
                        name: "bold",
                        title: "Bold",
                        action: SimpleMDE.toggleBold,
                        className: "mde-icons__bold",
                    },
                    {
                        name: "italic",
                        title: "Italic",
                        action: SimpleMDE.toggleItalic,
                        className: "mde-icons__italic",
                    },
                    {
                        name: "strikethrough",
                        title: "Strikethrough",
                        action: SimpleMDE.toggleStrikethrough,
                        className: "mde-icons__strikethrough",
                    },
                    {
                        name: "code",
                        title: "Code",
                        action: SimpleMDE.toggleCodeBlock,
                        className: "mde-icons__code",
                    },
                    "|",
                    {
                        name: "heading",
                        title: "Heading",
                        action: SimpleMDE.toggleHeadingSmaller,
                        className: "mde-icons__heading",
                    },
                    {
                        name: "quote",
                        title: "Quote",
                        action: SimpleMDE.toggleBlockquote,
                        className: "mde-icons__quote",
                    },
                    {
                        name: "unordered-list",
                        title: "Unordered List",
                        action: SimpleMDE.toggleUnorderedList,
                        className: "mde-icons__unordered-list",
                    },
                    {
                        name: "ordered-list",
                        title: "Ordered List",
                        action: SimpleMDE.toggleOrderedList,
                        className: "mde-icons__ordered-list",
                    },
                    "|",
                    {
                        name: "link",
                        title: "Link",
                        action: SimpleMDE.drawLink,
                        className: "mde-icons__link",
                    },
                    {
                        name: "image",
                        title: "Image",
                        action: SimpleMDE.drawImage,
                        className: "mde-icons__image",
                    },
                    {
                        name: "table",
                        title: "Table",
                        action: SimpleMDE.drawTable,
                        className: "mde-icons__table",
                    },
                    "|",
                    {
                        name: "preview",
                        title: "Preview",
                        action: SimpleMDE.togglePreview,
                        className: "no-disable mde-icons__preview",
                    },
                    {
                        name: "side-by-side",
                        title: "Side by Side",
                        action: SimpleMDE.toggleSideBySide,
                        className: "no-disable mde-icons__side-by-side",
                    },
                    {
                        name: "fullscreen",
                        title: "Fullscreen",
                        action: SimpleMDE.toggleFullScreen,
                        className: "no-disable mde-icons__fullscreen",
                    },
                    "|",
                    {
                        name: "guide",
                        title: "Help",
                        action: "https://simplemde.com/markdown-guide",
                        className: "mde-icons__guide",
                    },
                ],
            });
            rankSelect = new select_js_1.default({
                dom: modalCategory.getBody()._.rank._.select.dom,
                options: Object.keys(UserRank).filter((_) => typeof UserRank[_] === "number"),
            });
            productsList = new order_js_1.OrdenedElementList(document.querySelector("#product_list"), order_js_1.OrdenedElementList.NO_URL, {
                autoRefresh: true,
                idTarget: "uuid",
            }).setCustomFunctions({
                inputFn: (ctx) => {
                    var _a;
                    const inpZone = html_js_2.query(".input-zone", ctx.template);
                    const name = html_js_2.query(".name", inpZone);
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
            productsListSelector = new selectorList_js_1.RecomendedSelectorList({
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
            categoriesList = new order_js_1.OrdenedElementList(document.querySelector("#category_list"), order_js_1.OrdenedElementList.NO_URL, {
                autoRefresh: true,
                idTarget: "uuid",
            }).setCustomFunctions({
                inputFn: (ctx) => {
                    var _a;
                    const inpZone = html_js_2.query(".input-zone", ctx.template);
                    const name = html_js_2.query(".name", inpZone);
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
            categoriesListSelector = new selectorList_js_1.RecomendedSelectorList({
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
        }
    };
});
//# sourceMappingURL=categories.js.map