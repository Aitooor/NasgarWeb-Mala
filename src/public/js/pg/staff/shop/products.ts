/// <reference path="../../../../../../node_modules/@types/simplemde/index.d.ts" />
import Modal from "../../../components/modal.js";
import { jsonHtml, query as querySelector } from "../../../common/html.js";
import { OrdenedElementList } from "../../../components/list/order.js";
import { monetize, wait } from "../../../common/shop.js";

const SimpleMDE = window.SimpleMDE;

interface ItemData {
  uuid?: string;
  name: string;
  description: string;
  price: number;
  exec_cmd: string;
  exec_params: string;
  images: string[];
  category: string;
  created: number;
}

const filters = {
  created: 1,
  price: 0,
  name: 0,
  category: ".*",
  sale: 0,
};

const header_actions_div = document.querySelector(
  ".app .header .actions"
) as HTMLDivElement;

const items_list = document.querySelector(".app .items") as HTMLDivElement;

const item_template = document.querySelector(
  "template#item"
) as HTMLTemplateElement;

const header_action = {
  refresh: header_actions_div.querySelector(".refresh"),
  filter: header_actions_div.querySelector(".filter"),
  add: header_actions_div.querySelector(".add"),
} as {
  refresh: HTMLButtonElement;
  filter: HTMLButtonElement;
  add: HTMLButtonElement;
};

let refreshAction_isLoading = false;
const refreshAction_fn = (header_action.refresh.onclick = async () => {
  if (refreshAction_isLoading) return;
  refreshAction_isLoading = true;

  header_action.refresh.classList.add("anim");

  await Promise.all([wait(1000), refreshItems()]);

  header_action.refresh.classList.remove("anim");
  refreshAction_isLoading = false;
});

let filterAction_isRunning = false;
header_action.filter.onclick = async () => {
  if (filterAction_isRunning) return;
  filterAction_isRunning = true;
  header_action.filter.classList.add("anim");

  await wait(500);
  alert("Not implemented");

  header_action.filter.classList.remove("anim");
  filterAction_isRunning = false;
};

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

/** @type {{ [uuid: string]: ItemData }} */
let cache_items = {};

/** @type {string[]} */
let cache_ordened_uuid = [];

async function refreshItems() {
  items_list.classList.add("loading");

  items_list.innerHTML = "";

  await FetchItems();

  for (let uuid of cache_ordened_uuid)
    items_list.append(CreateItem(cache_items[uuid]));

  items_list.classList.remove("loading");
}

refreshAction_fn();

/**
 * @param {ItemData} data
 * @returns {Element}
 */
function CreateItem(data) {
  /** @type {Element} */
  const elm = ElementFromNode(
    item_template.content.firstElementChild.cloneNode(true)
  );

  const title = elm.querySelector(".name");
  title.innerHTML = data.name;

  const price = elm.querySelector(".price");
  price.innerHTML = monetize(data.price);

  elm.addEventListener("click", () => {
    OpenItemModal(data);
  });

  return elm;
}

/**——————————————————**/
/**       MODAL      **/
/**——————————————————**/

const modalItem_events = {
  _delete: (_: Modal) => {},
  _save: (_: Modal) => {},
};

const modalItem_Vars = {} as {
  cmd_fn?: () => void;
};

/** @type {HTMLDivElement} */
const modalItem_body = document.querySelector(
  "#item-editor-body"
) as HTMLDivElement;

const modalItem = new Modal({
  title: "Loading...",
  headerStyle: Modal.HeaderStyle.Solid,
  body: modalItem_body,
  cloneBody: true,
  actions: [
    {
      name: "Delete",
      color: Modal.ActionColor.Danger,
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

const updateMDE = new SimpleMDE({
  autoDownloadFontAwesome: false,
  spellChecker: false,
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

const tm_item_list_modal = (
  document.querySelector("template#list-item") as HTMLTemplateElement
).content.firstElementChild;

//#region Commands
function LoadCommandsOnItemModal(data: ItemData, actual_cmds: string[]) {
  for (let [command, i] of ArrayIndex(GetItemCommands(data)))
    NewCommandOnItemModal(command, i, actual_cmds);
}

function ThrowBadRequestOnItemModal(msg: string, title: string) {
  alert("Bad request: " + msg);

  modalItem.getActions()._.Save.classes.remove("disabled");
  modalItem.getActions()._.Cancel.classes.remove("disabled");

  modalItem.setHeader(title);
}

function EncodeCommands(
  commands: string[],
  title: string
): [boolean, [string, string]] {
  const exec_cmd = [];
  const exec_params = [];

  for (let cmd of commands) {
    if (cmd === null) continue;

    const s = /^([a-z0-9/_-]+)\s*(.*)$/i.exec(cmd);
    if (s === null)
      return (
        ThrowBadRequestOnItemModal("Commando no valido: " + cmd, title),
        [false, ["", ""]]
      );

    exec_cmd.push(s[1]);
    exec_params.push(s[2] || "");
  }

  return [true, [exec_cmd.join(" [&&] "), exec_params.join(" [&&] ")]];
}

function NewCommandOnItemModal(
  cmd: string,
  index: number,
  cmds_obj: string[]
): HTMLElement {
  const command_list = modalItem.getBody()._.commands._.list.dom;
  cmds_obj[index] = cmd;

  const elm = ElementFromNode(tm_item_list_modal.cloneNode(true));
  /**
   * @ignore
   * @type {HTMLInputElement}
   */
  const inp = elm.querySelector(".input") as HTMLInputElement;

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

function SetCommandActions(cmds: string[]) {
  const command_list = modalItem.getBody()._.commands._.list.dom;

  const addBtn = modalItem.getBody()._.commands._.header._.actions._.button.dom;

  // Clear commands
  command_list.innerHTML = "";

  if (modalItem_Vars.cmd_fn) RemEvent("click", addBtn, modalItem_Vars.cmd_fn);
  modalItem_Vars.cmd_fn = () => {
    NewCommandOnItemModal("", cmds.length, cmds).focus();
  };

  AddEvent("click", addBtn, modalItem_Vars.cmd_fn);
}
//#endregion

function UpdateData(
  property: [object, string],
  elm: jsonHtml<HTMLInputElement>,
  _default: string,
  pre?: (value: string) => any
) {
  elm.dom.value = _default;
  pre = pre || ((_) => _);
  property[0][property[1]] = _default;

  elm.events.add("change", () => {
    property[0][property[1]] = pre(elm.dom.value);
  });
}

function OpenAddModal() {
  /** @type {ItemData} */
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

  // Title of modal
  modalItem.setHeader("New Item");
  body._.uuid.classes.add("hidden");
  modalItem.getActions()._.Delete.classes.add("hidden");

  updateMDE.value(" ");

  // Fields of modal
  const imageListDOM = body._.images._.list.dom as HTMLDivElement;
  imageListDOM.innerHTML = "";
  /** @type {OrdenedElementList<{ url: string }>} */
  const imageList = new OrdenedElementList(
    imageListDOM,
    OrdenedElementList.NO_URL,
    {
      autoRefresh: true,
      idTarget: "url",
    }
  ).setCustomFunctions({
    inputFn(ctx) {
      ctx.usePipe("custom:change", ctx.data);
    },
  }).setTemplate(/*html*/ `
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
      const img = imageListDOM.querySelector(
        ".list-item__img"
      ) as HTMLImageElement;
      const input = imageListDOM.querySelector("input");

      img.src = input.value;
      data.url = input.value;

      actual_item_data.images = imageList.getData().map((v) => v.url);
    }
  });

  UpdateData(
    [actual_item_data, "category"],
    body._.category._.input as jsonHtml<HTMLInputElement>,
    "def"
  );

  UpdateData(
    [actual_item_data, "name"],
    body._.name._.input as jsonHtml<HTMLInputElement>,
    ""
  );

  UpdateData(
    [actual_item_data, "price"],
    body._.price._.input as jsonHtml<HTMLInputElement>,
    "0",
    parseFloat
  );

  SetCommandActions(actual_cmds);

  /** @type {Modal} modal */
  modalItem_events._save = async (modal) => {
    modal.disableActions();
    modal.setHeader("New item [SAVING]");

    const [success, [exec_cmd, exec_params]] = EncodeCommands(
      actual_cmds,
      "New Item"
    );

    if (!success) return modal.undisableActions();

    try {
      await AddItem({
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
    } catch (err) {
      alert(err);
      console.error(err);
      modal.undisableActions();
      return;
    }

    await refreshItems();

    modal.undisableActions();
    modal.close();
    modal.drainEvents();
  };

  modalItem.open();
}

function OpenItemModal(data: ItemData) {
  /* @type {ItemData} */
  const actual_item_data = JSON.parse(JSON.stringify(data));
  const actual_cmds = [];

  const body = modalItem.getBody();

  // Title of modal
  modalItem.setHeader(data.name);
  const uuid_s = body._.uuid;
  uuid_s.dom.innerHTML = "UUID: " + data.uuid;
  uuid_s.classes.remove("hidden");
  modalItem.getActions()._.Delete.classes.remove("hidden");

  updateMDE.value(data.description);

  // Fields of modal
  const imageListDOM = body._.images._.list.dom as HTMLDivElement;
  imageListDOM.innerHTML = "";
  /** @type {OrdenedElementList<{ url: string }>} */
  const imageList = new OrdenedElementList(
    imageListDOM,
    OrdenedElementList.NO_URL,
    {
      autoRefresh: true,
      idTarget: "url",
    }
  ).setCustomFunctions({
    inputFn(ctx) {
      ctx.usePipe("custom:change", ctx.data);
    },
  }).setTemplate(/*html*/ `
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
      const img = imageListDOM.querySelector(
        ".list-item__img"
      ) as HTMLImageElement;
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

  UpdateData(
    [actual_item_data, "category"],
    body._.category._.input as jsonHtml<HTMLInputElement>,
    data.category
  );

  UpdateData(
    [actual_item_data, "name"],
    body._.name._.input as jsonHtml<HTMLInputElement>,
    data.name
  );

  UpdateData(
    [actual_item_data, "price"],
    body._.price._.input as jsonHtml<HTMLInputElement>,
    data.price.toString(),
    parseFloat
  );

  SetCommandActions(actual_cmds);
  LoadCommandsOnItemModal(data, actual_cmds);

  /** @param {Modal} modal */
  modalItem_events._save = async (modal) => {
    modal.disableActions();

    modal.setHeader(data.name + " [SAVING]");

    const [success, [exec_cmd, exec_params]] = EncodeCommands(
      actual_cmds,
      data.name
    );

    if (!success) return modal.undisableActions();

    try {
      await UpdateItem({
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
    } catch (err) {
      alert(err);
      console.error(err);
      modal.undisableActions();
      return;
    }

    await refreshItems();

    modal.undisableActions();
    modal.drainEvents();
    modal.close();
  };

  /** @param {Modal} modal */
  modalItem_events._delete = async (modal) => {
    if (confirm("Are you sure?")) {
      if (await RemItem(data.uuid, prompt('Write: "DELETE"'))) {
        modal.close();
        refreshItems();
      }
    }
  };

  modalItem.open();
}

//#region Helpers
/**
 * @param {string} ev
 * @param {Element} elm
 * @param {(event?: Event) => void} fn
 */
function RemEvent(ev, elm, fn) {
  elm.removeEventListener(ev, fn);
}

/**
 * AddEvent(#ev, #parent.querySelector(#selector), fn);
 * @param {string} ev
 * @param {Element} parent
 * @param {string} selector
 * @param {(event?: Event) => void} fn
 */
function AddEventChild(ev, parent, selector, fn) {
  AddEvent(ev, parent.querySelector(selector), fn);
}

/**
 * @param {string} ev
 * @param {Element} elm
 * @param {(event?: Event) => void} fn
 */
function AddEvent(ev, elm, fn) {
  elm.addEventListener(ev, fn);
}

/**
 * @param {Node} node
 * @returns {HTMLElement}
 */
function ElementFromNode(node) {
  const elm = document.createElement("div");
  elm.appendChild(node);

  // @ts-ignore
  return elm.firstElementChild;
}

/**
 * @param {ItemData} data
 * @returns {string[]}
 */
function GetItemCommands(data) {
  const cmds = data.exec_cmd.split(" [&&] ");
  const params = data.exec_params.split(" [&&] ");

  if (cmds.length === 1 && cmds[0].match(/^\s*$/)) return [];

  return new Array(cmds.length).fill(0).map((_, i) => {
    return cmds[i] + " " + params[i];
  });
}

/**
 * @param {ArrayLike<any>} arr
 * @returns {Generator<[any, number]>}
 */
function* ArrayIndex(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield [arr[i], i];
  }
}

//#endregion

function PrePostItem(data: ItemData) {
  if (data.name.length > 30) throw new RangeError("Name is very long. Max 30.");
  if (data.price <= 0)
    throw new RangeError("Price is negative or zero. only accept positive");
}

async function UpdateItem(data: ItemData): Promise<boolean> {
  PrePostItem(data);
  const res = await fetch("/api/update/product", {
    method: "POST",
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

async function AddItem(data: ItemData): Promise<boolean> {
  PrePostItem(data);
  const res = await fetch("/api/add/product", {
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
  const res = await fetch("/api/delete/product", {
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
}

/**
 * @returns {Promise<{ [uuid: string]: ItemData }>}
 */
async function FetchItems() {
  const res = await fetch("/api/get/products", {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) alert("Error fetching products data.");

  /** @type {ItemData[]} */
  const json = await res.json();

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
}
