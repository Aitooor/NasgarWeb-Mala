var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Modal from "../../components/modal.js";
import ElementList from "../../components/list/list.js";
import { wait } from "../../common/shop.js";
import { query as querySelector } from "../../common/html.js";
const SimpleMDE = window.SimpleMDE;
let cacheUpdates = [];
const header_actions_div = querySelector(".page-header-actions");
function normalizeNumber(n) {
    return n < 10 ? "0" + n : n.toString();
}
const updates_list = querySelector(".card-list.updates");
const update_template = querySelector("template#update");
const update_list = new ElementList(updates_list, "/api/updates", { idTarget: "uuid" })
    .setCustomFunctions({
    formatDate: (date) => {
        const d = new Date(date);
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return `${normalizeNumber(d.getDate())}/${months[d.getMonth()]}/${d.getFullYear()}`;
    },
})
    .setTemplate(`
  <div class="card-list-element">
    <div class="card-list-element__title">
      <span slot="title">Update 1.0.0</span>
    </div>
    <div class="card-list-element__footer">
      <span slot="date" data-slot-formatter="formatDate">24/06/2020</span>
    </div>
  </div>
  `)
    .setOnClick((_, elm, data) => {
    OpenUpdateModal(data);
});
const header_action = {
    refresh: querySelector(".refresh", header_actions_div),
    add: querySelector(".add", header_actions_div),
};
const refreshAction_fn = () => __awaiter(void 0, void 0, void 0, function* () {
    if (update_list.isLoading)
        return;
    header_action.refresh.classList.add("anim");
    yield Promise.all([wait(1000), update_list.refresh()]);
    header_action.refresh.classList.remove("anim");
});
header_action.refresh.onclick = refreshAction_fn;
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
const modalUpdate_events = {
    _delete: (_) => { },
    _save: (_) => { },
};
const modalUpdate_Vars = {};
const modalUpdate_body = querySelector("#update-editor-body");
const modalUpdate = new Modal({
    title: "Loading...",
    headerStyle: Modal.HeaderStyle.Solid,
    body: modalUpdate_body,
    cloneBody: true,
    actions: [
        {
            name: "Delete",
            color: Modal.ActionColor.Danger,
            onClick: (modal) => {
                modalUpdate_events._delete(modal);
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
                modalUpdate_events._save(modal);
            },
        },
    ],
});
const updateMDE = new SimpleMDE({
    autoDownloadFontAwesome: false,
    spellChecker: false,
    element: querySelector("#content"),
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
function UpdateData(property, elm, _default, pre) {
    elm.dom.value = _default;
    pre = pre || ((_) => _);
    property[0][property[1]] = pre(_default, elm);
    elm.events.add("input", () => {
        property[0][property[1]] = pre(elm.dom.value, elm);
    });
}
function OpenAddModal() {
    const actual_update_data = {
        uuid: "",
        title: "",
        content: "",
        date: Date.now(),
    };
    const body = modalUpdate.getBody();
    modalUpdate.setHeader("New Update");
    body._.uuid.classes.add("hidden");
    modalUpdate.getActions()._.Delete.classes.add("hidden");
    UpdateData([actual_update_data, "title"], body._.title._.input, "");
    modalUpdate_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
        modal.disableActions();
        modal.setHeader("New update [SAVING]");
        try {
            yield AddUpdate({
                uuid: "",
                title: actual_update_data.title,
                content: updateMDE.value(),
                date: actual_update_data.date,
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
    modalUpdate.open();
}
function OpenUpdateModal(data) {
    const actual_update_data = JSON.parse(JSON.stringify(data));
    const body = modalUpdate.getBody();
    modalUpdate.setHeader(data.title);
    const uuid_s = body._.uuid;
    uuid_s.dom.innerHTML = "UUID: " + data.uuid;
    uuid_s.classes.remove("hidden");
    modalUpdate.getActions()._.Delete.classes.remove("hidden");
    updateMDE.value(data.content);
    window.codemirror = updateMDE.codemirror;
    UpdateData([actual_update_data, "title"], body._.title._.input, actual_update_data.title);
    modalUpdate_events._save = (modal) => __awaiter(this, void 0, void 0, function* () {
        modal.disableActions();
        modal.setHeader(data.title + " [SAVING]");
        try {
            yield UpdateItem({
                uuid: actual_update_data.uuid,
                title: actual_update_data.title,
                content: updateMDE.value(),
                date: actual_update_data.date,
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
    modalUpdate_events._delete = (modal) => __awaiter(this, void 0, void 0, function* () {
        if (confirm("Are you sure?")) {
            if (yield RemItem(data.uuid, prompt('Write: "DELETE"'))) {
                modal.close();
                refreshAction_fn();
            }
        }
    });
    modalUpdate.open();
    updateMDE.codemirror.refresh();
}
function PrePostItem(data) {
    if (data.title.length > 255)
        throw new RangeError("Name is very long. Max 255.");
}
function UpdateItem(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        PrePostItem(data);
        const res = yield fetch("/api/updates", {
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
function AddUpdate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        PrePostItem(data);
        const res = yield fetch("/api/updates", {
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
        const res = yield fetch("/api/updates", {
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
//# sourceMappingURL=updates.js.map