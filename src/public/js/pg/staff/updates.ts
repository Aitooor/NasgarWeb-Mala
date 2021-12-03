/// <reference path="../../../../..//node_modules/@types/simplemde/index.d.ts" />
import Modal from "../../components/modal.js";
import ElementList from "../../components/list/list.js";
import { jsonHtml } from "../../common/html.js";
import { wait } from "../../common/shop.js";
import { RecomendedSelectorList } from "../../components/selector_list/selectorList.js";
import { query as querySelector } from "../../common/html.js";

const SimpleMDE = window.SimpleMDE;

interface Update {
  uuid: string;
  title: string;
  content: string;
  date: number;
}

// const filters = {
//   created: 1,
//   price: 0,
//   name: 0,
//   update: ".*",
//   sale: 0
// }

let cacheUpdates: Update[] = [];

const header_actions_div: HTMLDivElement = querySelector<HTMLDivElement>(
  ".page-header-actions"
);

function normalizeNumber(n: number): string {
  return n < 10 ? "0" + n : n.toString();
}

//#region Updates list
const updates_list: HTMLDivElement =
  querySelector<HTMLDivElement>(".card-list.updates");

const update_template: HTMLTemplateElement =
  querySelector<HTMLTemplateElement>("template#update");

const update_list = new ElementList<Update, HTMLDivElement>(
  updates_list,
  "/api/updates",
  { idTarget: "uuid" }
)
  .setCustomFunctions({
    formatDate: (date: number) => {
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
      return `${normalizeNumber(d.getDate())}/${
        months[d.getMonth()]
      }/${d.getFullYear()}`;
    },
  })
  .setTemplate(
    `
  <div class="card-list-element">
    <div class="card-list-element__title">
      <span slot="title">Update 1.0.0</span>
    </div>
    <div class="card-list-element__footer">
      <span slot="date" data-slot-formatter="formatDate">24/06/2020</span>
    </div>
  </div>
  `
  )
  .setOnClick((_, elm: HTMLDivElement, data: Update) => {
    OpenUpdateModal(data);
  });
//#endregion

//#region Header actions
const header_action = {
  refresh: querySelector<HTMLButtonElement>(".refresh", header_actions_div),
  add: querySelector<HTMLButtonElement>(".add", header_actions_div),
};

const refreshAction_fn = async () => {
  if (update_list.isLoading) return;
  header_action.refresh.classList.add("anim");
  await Promise.all([wait(1000), update_list.refresh()]);
  header_action.refresh.classList.remove("anim");
};
header_action.refresh.onclick = refreshAction_fn;

let addAction_isRunning = false;
header_action.add.onclick = async () => {
  if (addAction_isRunning) return;
  addAction_isRunning = true;
  header_action.add.classList.add("anim");

  await wait(500);
  OpenAddModal();

  header_action.add.classList.remove("anim");
  addAction_isRunning = false;
};

refreshAction_fn();
//#endregion

/**——————————————————**/
/**       MODAL      **/
/**——————————————————**/

const modalUpdate_events = {
  _delete: (_: Modal) => {},
  _save: (_: Modal) => {},
};

const modalUpdate_Vars: {
  ctg_fn?: () => void;
} = {};

const modalUpdate_body = querySelector<HTMLDivElement>("#update-editor-body");

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
  element: querySelector<HTMLTextAreaElement>("#content"),
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

function UpdateData(
  property: [object, string],
  elm: jsonHtml<HTMLInputElement>,
  _default: string,
  pre?: (value: string, element: jsonHtml<HTMLInputElement>) => any
) {
  elm.dom.value = _default;
  pre = pre || ((_) => _);
  property[0][property[1]] = pre(_default, elm);

  elm.events.add("input", () => {
    property[0][property[1]] = pre(elm.dom.value, elm);
  });
}

function OpenAddModal() {
  const actual_update_data: Update = {
    uuid: "",
    title: "",
    content: "",
    date: Date.now(),
  };

  const body = modalUpdate.getBody();

  // Title of modal
  modalUpdate.setHeader("New Update");
  body._.uuid.classes.add("hidden");
  modalUpdate.getActions()._.Delete.classes.add("hidden");

  // Fields of modal

  UpdateData(
    [actual_update_data, "title"],
    <jsonHtml<HTMLInputElement>>body._.title._.input,
    ""
  );

  modalUpdate_events._save = async (modal: Modal) => {
    modal.disableActions();
    modal.setHeader("New update [SAVING]");

    try {
      await AddUpdate({
        uuid: "",
        title: actual_update_data.title,
        content: updateMDE.value(),
        date: actual_update_data.date,
      });
    } catch (err) {
      alert(err);
      console.error(err);
      return;
    }

    await refreshAction_fn();

    modal.undisableActions();
    modal.close();
    modal.drainEvents();
  };

  modalUpdate.open();
}

function OpenUpdateModal(data: Update) {
  const actual_update_data: Update = JSON.parse(JSON.stringify(data));

  const body = modalUpdate.getBody();

  // Title of modal
  modalUpdate.setHeader(data.title);
  const uuid_s = body._.uuid;
  uuid_s.dom.innerHTML = "UUID: " + data.uuid;
  uuid_s.classes.remove("hidden");
  modalUpdate.getActions()._.Delete.classes.remove("hidden");

  // Fields of modal

  UpdateData(
    [actual_update_data, "title"],
    <jsonHtml<HTMLInputElement>>body._.title._.input,
    actual_update_data.title
  );

  /** @param {Modal} modal */
  modalUpdate_events._save = async (modal) => {
    modal.disableActions();

    modal.setHeader(data.title + " [SAVING]");

    try {
      await UpdateItem({
        uuid: actual_update_data.uuid,
        title: actual_update_data.title,
        content: updateMDE.value(),
        date: actual_update_data.date,
      });
    } catch (err) {
      alert(err);
      return;
    }

    await refreshAction_fn();

    modal.undisableActions();
    modal.drainEvents();
    modal.close();
  };

  /** @param {Modal} modal */
  modalUpdate_events._delete = async (modal) => {
    if (confirm("Are you sure?")) {
      if (await RemItem(data.uuid, prompt('Write: "DELETE"'))) {
        modal.close();
        refreshAction_fn();
      }
    }
  };

  modalUpdate.open();
}


function PrePostItem(data: Update) {
  if (data.title.length > 255)
    throw new RangeError("Name is very long. Max 30.");
}


async function UpdateItem(data: Update): Promise<Boolean> {
  PrePostItem(data);
  const res = await fetch("/api/shop/update", {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 500)
    return (
      (alert("Error updating product: " + (await res.json())?.error), true),
      false
    );
  return true;
}

async function AddUpdate(data: Update) {
  PrePostItem(data);
  const res = await fetch("/api/shop/update", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) return alert("Error adding item."), false;

  return true;
}

async function RemItem(uuid: string, confirmation: string) {
  const res = await fetch("/api/shop/update", {
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
}

/**************************/
/***    Product List    ***/
/**************************/

(async () => {
  const res = await fetch("/api/get/products", {
    headers: {
      accept: "application/json",
    },
    credentials: "same-origin",
  });

  if (!res.ok) return;
  cacheUpdates = await res.json();
})();
