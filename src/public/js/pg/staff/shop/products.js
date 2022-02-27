System.register(["../../../components/modal.js", "../../../common/html.js", "../../../components/list/order.js", "../../../common/shop.js"], function (exports_1, context_1) {
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
    var modal_js_1, html_js_1, order_js_1, shop_js_1, SimpleMDE, filters, header_actions_div, items_list, item_template, header_action, refreshAction_isLoading, refreshAction_fn, filterAction_isRunning, addAction_isRunning, cache_items, cache_ordened_uuid, modalItem_events, modalItem_Vars, modalItem_body, modalItem, updateMDE, tm_item_list_modal;
    var __moduleName = context_1 && context_1.id;
    function refreshItems() {
        return __awaiter(this, void 0, void 0, function* () {
            items_list.classList.add("loading");
            items_list.innerHTML = "";
            yield FetchItems();
            for (let uuid of cache_ordened_uuid)
                items_list.append(CreateItem(cache_items[uuid]));
            items_list.classList.remove("loading");
        });
    }
    function CreateItem(data) {
        const elm = ElementFromNode(item_template.content.firstElementChild.cloneNode(true));
        const title = elm.querySelector(".name");
        title.innerHTML = data.name;
        const price = elm.querySelector(".price");
        price.innerHTML = shop_js_1.monetize(data.price);
        elm.addEventListener("click", () => {
            OpenItemModal(data);
        });
        return elm;
    }
    function LoadCommandsOnItemModal(data, actual_cmds) {
        for (let [command, i] of ArrayIndex(GetItemCommands(data)))
            NewCommandOnItemModal(command, i, actual_cmds);
    }
    function ThrowBadRequestOnItemModal(msg, title) {
        alert("Bad request: " + msg);
        modalItem.getActions()._.Save.classes.remove("disabled");
        modalItem.getActions()._.Cancel.classes.remove("disabled");
        modalItem.setHeader(title);
    }
    function EncodeCommands(commands, title) {
        const exec_cmd = [];
        const exec_params = [];
        for (let cmd of commands) {
            if (cmd === null)
                continue;
            const s = /^([a-z0-9/_-]+)\s*(.*)$/i.exec(cmd);
            if (s === null)
                return (ThrowBadRequestOnItemModal("Commando no valido: " + cmd, title),
                    [false, ["", ""]]);
            exec_cmd.push(s[1]);
            exec_params.push(s[2] || "");
        }
        return [true, [exec_cmd.join(" [&&] "), exec_params.join(" [&&] ")]];
    }
    function NewCommandOnItemModal(cmd, index, cmds_obj) {
        const command_list = modalItem.getBody()._.commands._.list.dom;
        cmds_obj[index] = cmd;
        const elm = ElementFromNode(tm_item_list_modal.cloneNode(true));
        const inp = elm.querySelector(".input");
        inp.value = cmd;
        AddEvent("input", inp, () => {
            cmds_obj[index] = inp.value;
        });
        AddEventChild("click", elm, ".delete", () => {
            cmds_obj[index] = null;
            elm.remove();
        });
        command_list.append(elm);
        return inp;
    }
    function SetCommandActions(cmds) {
        const command_list = modalItem.getBody()._.commands._.list.dom;
        const addBtn = modalItem.getBody()._.commands._.header._.actions._.button.dom;
        command_list.innerHTML = "";
        if (modalItem_Vars.cmd_fn)
            RemEvent("click", addBtn, modalItem_Vars.cmd_fn);
        modalItem_Vars.cmd_fn = () => {
            NewCommandOnItemModal("", cmds.length, cmds).focus();
        };
        AddEvent("click", addBtn, modalItem_Vars.cmd_fn);
    }
    function UpdateData(property, elm, _default, pre) {
        elm.dom.value = _default;
        pre = pre || ((_) => _);
        property[0][property[1]] = _default;
        elm.events.add("change", () => {
            property[0][property[1]] = pre(elm.dom.value);
        });
    }
    function OpenAddModal() {
        const actual_item_data = {
            uuid: "",
            name: "",
            description: "",
            category: "def",
            price: 0,
            exec_cmd: "",
            exec_params: "",
            images: [],
            created: Date.now(),
        };
        const actual_cmds = [];
        const body = modalItem.getBody();
        modalItem.setHeader("New Item");
        body._.uuid.classes.add("hidden");
        modalItem.getActions()._.Delete.classes.add("hidden");
        updateMDE.value(" ");
        const imageListDOM = body._.images._.list.dom;
        imageListDOM.innerHTML = "";
        const imageList = new order_js_1.OrdenedElementList(imageListDOM, order_js_1.OrdenedElementList.NO_URL, {
            autoRefresh: true,
            idTarget: "url",
        }).setCustomFunctions({
            inputFn(ctx) {
                ctx.usePipe("custom:change", ctx.data);
            },
        }).setTemplate(`
    <div class="list-item list__item--image">
      <div class="input-zone">
        <img class="list-item__img" slot="url" data-slot-attribute="src">
        <input type="text" data-slot-events="input" data-oninput="this.custom.inputFn(this);" slot="url" placeholder="URL">
      </div>
      <button class="delete" >
        <i class="material" data-slot-events="click" data-onclick="this.fn.delete(); this.usePipe('custom:change', this.data);">delete</i> 
      </button>
      <div class="ord-btns">
        <button class="up" data-slot-events="click" data-onclick="this.fn.goUp(); this.usePipe('custom:change', this.data);"><i class="material">keyboard_arrow_up</i></button>
        <button class="down" data-slot-events="click" data-onclick="this.fn.goDown(); this.usePipe('custom:change', this.data);"><i class="material">keyboard_arrow_down</i></button>
      </div>
    </div>
  `);
        imageList.pipe((method, data) => {
            if (method === "custom:change") {
                const img = imageListDOM.querySelector(".list-item__img");
                const input = imageListDOM.querySelector("input");
                img.src = input.value;
                data.url = input.value;
                actual_item_data.images = imageList.getData().map((v) => v.url);
            }
        });
        UpdateData([actual_item_data, "category"], body._.category._.input, "def");
        UpdateData([actual_item_data, "name"], body._.name._.input, "");
        UpdateData([actual_item_data, "price"], body._.price._.input, "0", parseFloat);
        SetCommandActions(actual_cmds);
        modalItem_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
            modal.disableActions();
            modal.setHeader("New item [SAVING]");
            const [success, [exec_cmd, exec_params]] = EncodeCommands(actual_cmds, "New Item");
            if (!success)
                return modal.undisableActions();
            try {
                yield AddItem({
                    uuid: "",
                    name: actual_item_data.name,
                    description: updateMDE.value(),
                    price: actual_item_data.price,
                    exec_cmd: exec_cmd,
                    exec_params: exec_params,
                    images: actual_item_data.images,
                    created: actual_item_data.created,
                    category: actual_item_data.category,
                });
            }
            catch (err) {
                alert(err);
                console.error(err);
                modal.undisableActions();
                return;
            }
            yield refreshItems();
            modal.undisableActions();
            modal.close();
            modal.drainEvents();
        });
        modalItem.open();
    }
    function OpenItemModal(data) {
        const actual_item_data = JSON.parse(JSON.stringify(data));
        const actual_cmds = [];
        const body = modalItem.getBody();
        modalItem.setHeader(data.name);
        const uuid_s = body._.uuid;
        uuid_s.dom.innerHTML = "UUID: " + data.uuid;
        uuid_s.classes.remove("hidden");
        modalItem.getActions()._.Delete.classes.remove("hidden");
        updateMDE.value(data.description);
        const imageListDOM = body._.images._.list.dom;
        imageListDOM.innerHTML = "";
        const imageList = new order_js_1.OrdenedElementList(imageListDOM, order_js_1.OrdenedElementList.NO_URL, {
            autoRefresh: true,
            idTarget: "url",
        }).setCustomFunctions({
            inputFn(ctx) {
                ctx.usePipe("custom:change", ctx.data);
            },
        }).setTemplate(`
    <div class="list-item list__item--image">
      <div class="input-zone">
        <img class="list-item__img" slot="url" data-slot-attribute="src">
        <input type="text" data-slot-events="input" data-oninput="this.custom.inputFn(this);" slot="url" placeholder="URL">
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
        for (const image of data.images) {
            imageList.add({ url: image });
        }
        imageList.pipe((method, data) => {
            if (method === "custom:change") {
                const img = imageListDOM.querySelector(".list-item__img");
                const input = imageListDOM.querySelector("input");
                img.src = input.value;
                data.url = input.value;
                actual_item_data.images = imageList.getData().map((v) => v.url);
            }
        });
        body._.images._.header._.actions._.button.events.add("click", () => {
            imageList.add({
                url: "",
            });
        });
        UpdateData([actual_item_data, "category"], body._.category._.input, data.category);
        UpdateData([actual_item_data, "name"], body._.name._.input, data.name);
        UpdateData([actual_item_data, "price"], body._.price._.input, data.price.toString(), parseFloat);
        SetCommandActions(actual_cmds);
        LoadCommandsOnItemModal(data, actual_cmds);
        modalItem_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
            modal.disableActions();
            modal.setHeader(data.name + " [SAVING]");
            const [success, [exec_cmd, exec_params]] = EncodeCommands(actual_cmds, data.name);
            if (!success)
                return modal.undisableActions();
            try {
                yield UpdateItem({
                    uuid: data.uuid,
                    name: actual_item_data.name,
                    description: updateMDE.value(),
                    price: actual_item_data.price,
                    exec_cmd: exec_cmd,
                    exec_params: exec_params,
                    images: actual_item_data.images,
                    created: Date.now(),
                    category: actual_item_data.category,
                });
            }
            catch (err) {
                alert(err);
                console.error(err);
                modal.undisableActions();
                return;
            }
            yield refreshItems();
            modal.undisableActions();
            modal.drainEvents();
            modal.close();
        });
        modalItem_events._delete = (modal) => __awaiter(this, void 0, void 0, function* () {
            if (confirm("Are you sure?")) {
                if (yield RemItem(data.uuid, prompt('Write: "DELETE"'))) {
                    modal.close();
                    refreshItems();
                }
            }
        });
        modalItem.open();
    }
    function RemEvent(ev, elm, fn) {
        elm.removeEventListener(ev, fn);
    }
    function AddEventChild(ev, parent, selector, fn) {
        AddEvent(ev, parent.querySelector(selector), fn);
    }
    function AddEvent(ev, elm, fn) {
        elm.addEventListener(ev, fn);
    }
    function ElementFromNode(node) {
        const elm = document.createElement("div");
        elm.appendChild(node);
        return elm.firstElementChild;
    }
    function GetItemCommands(data) {
        const cmds = data.exec_cmd.split(" [&&] ");
        const params = data.exec_params.split(" [&&] ");
        if (cmds.length === 1 && cmds[0].match(/^\s*$/))
            return [];
        return new Array(cmds.length).fill(0).map((_, i) => {
            return cmds[i] + " " + params[i];
        });
    }
    function* ArrayIndex(arr) {
        for (let i = 0; i < arr.length; i++) {
            yield [arr[i], i];
        }
    }
    function PrePostItem(data) {
        if (data.name.length > 30)
            throw new RangeError("Name is very long. Max 30.");
        if (data.price <= 0)
            throw new RangeError("Price is negative or zero. only accept positive");
    }
    function UpdateItem(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            PrePostItem(data);
            const res = yield fetch("/api/update/product", {
                method: "POST",
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
    function AddItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            PrePostItem(data);
            const res = yield fetch("/api/add/product", {
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
            const res = yield fetch("/api/delete/product", {
                method: "POST",
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
    function FetchItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch("/api/get/products", {
                method: "GET",
                cache: "no-cache",
            });
            if (!res.ok)
                alert("Error fetching products data.");
            const json = yield res.json();
            cache_ordened_uuid = [];
            cache_items = json.reduce((obj, item) => {
                obj[item.uuid] = item;
                cache_ordened_uuid.push(item.uuid);
                return obj;
            }, {});
            cache_ordened_uuid.sort((a, b) => {
                return cache_items[a].name.localeCompare(cache_items[b].name);
            });
            return cache_items;
        });
    }
    return {
        setters: [
            function (modal_js_1_1) {
                modal_js_1 = modal_js_1_1;
            },
            function (html_js_1_1) {
                html_js_1 = html_js_1_1;
            },
            function (order_js_1_1) {
                order_js_1 = order_js_1_1;
            },
            function (shop_js_1_1) {
                shop_js_1 = shop_js_1_1;
            }
        ],
        execute: function () {
            SimpleMDE = window.SimpleMDE;
            filters = {
                created: 1,
                price: 0,
                name: 0,
                category: ".*",
                sale: 0,
            };
            header_actions_div = document.querySelector(".app .header .actions");
            items_list = document.querySelector(".app .items");
            item_template = document.querySelector("template#item");
            header_action = {
                refresh: header_actions_div.querySelector(".refresh"),
                filter: header_actions_div.querySelector(".filter"),
                add: header_actions_div.querySelector(".add"),
            };
            refreshAction_isLoading = false;
            refreshAction_fn = (header_action.refresh.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                if (refreshAction_isLoading)
                    return;
                refreshAction_isLoading = true;
                header_action.refresh.classList.add("anim");
                yield Promise.all([shop_js_1.wait(1000), refreshItems()]);
                header_action.refresh.classList.remove("anim");
                refreshAction_isLoading = false;
            }));
            filterAction_isRunning = false;
            header_action.filter.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                if (filterAction_isRunning)
                    return;
                filterAction_isRunning = true;
                header_action.filter.classList.add("anim");
                yield shop_js_1.wait(500);
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
            cache_items = {};
            cache_ordened_uuid = [];
            refreshAction_fn();
            modalItem_events = {
                _delete: (_) => { },
                _save: (_) => { },
            };
            modalItem_Vars = {};
            modalItem_body = document.querySelector("#item-editor-body");
            modalItem = new modal_js_1.default({
                title: "Loading...",
                headerStyle: modal_js_1.default.HeaderStyle.Solid,
                body: modalItem_body,
                cloneBody: true,
                actions: [
                    {
                        name: "Delete",
                        color: modal_js_1.default.ActionColor.Danger,
                        onClick: (modal) => {
                            modalItem_events._delete(modal);
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
                            modalItem_events._save(modal);
                        },
                    },
                ],
            });
            updateMDE = new SimpleMDE({
                autoDownloadFontAwesome: false,
                spellChecker: false,
                element: html_js_1.query("#content"),
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
            tm_item_list_modal = document.querySelector("template#list-item").content.firstElementChild;
        }
    };
});
//# sourceMappingURL=products.js.map