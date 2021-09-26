
import { monetize, wait, capitalize, applyFilter } from '../../common/shop.js';

/**
 * @typedef {{ uuid?: string, name: string, description: string, price: number, exec_cmd: string, exec_params: string, images: string[], category: string, created: number }} ItemData
 */

const filters = {
  created: 1,
  price: 0,
  name: 0,
  category: ".*",
  sale: 0
}

const header_actions_div = document.querySelector(".app .header .actions"); 

/** @type {HTMLDivElement} */
const items_list = document.querySelector(".app .items");

/** @type {HTMLTemplateElement} */
const item_template = document.querySelector("template#item");


/** @type {{ refresh: HTMLButtonElement, filter: HTMLButtonElement, add: HTMLButtonElement }} */
const header_action = {
  refresh: header_actions_div.querySelector(".refresh"),
  filter: header_actions_div.querySelector(".filter"),
  add: header_actions_div.querySelector(".add")
};

let refreshAction_isLoading = false;
const refreshAction_fn = 
header_action.refresh.onclick = async () => {
  if(refreshAction_isLoading) return;
  refreshAction_isLoading = true;

  header_action.refresh.classList.add("anim");

  await Promise.all([wait(1000), refreshItems()]);
  
  header_action.refresh.classList.remove("anim");
  refreshAction_isLoading = false;
};

let filterAction_isRunning = false;
header_action.filter.onclick = async () => {
  if(filterAction_isRunning) return;
  filterAction_isRunning = true;
  header_action.filter.classList.add("anim");

  await wait(700);
  alert("Not implemented");

  header_action.filter.classList.remove("anim");
  filterAction_isRunning = false;
};

let addAction_isRunning = false;
header_action.add.onclick = async () => {
  if(addAction_isRunning) return;
  addAction_isRunning = true;
  header_action.add.classList.add("anim");

  await wait(700);
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

  for(let uuid of cache_ordened_uuid) 
    items_list.append(CreateItem(cache_items[uuid]));
  
  items_list.classList.remove("loading");
}

refreshAction_fn().catch(alert);

/**
 * @param {ItemData} data
 * @returns {Element}
 */
function CreateItem(data) {
  /** @type {Element} */
  const elm = ElementFromNode(item_template.content.firstElementChild.cloneNode(true));

  const title = elm.querySelector(".name");
  title.innerHTML = data.name;
  
  const category = elm.querySelector(".category");
  category.innerHTML = capitalize(data.category);

  const price = elm.querySelector(".price");
  price.innerHTML = monetize(data.price);

  elm.addEventListener("click", () => {try{
    OpenItemModal(data);
  } catch(e) {alert(e)}});

  return elm;
}

/**——————————————————**/
/**       MODAL      **/
/**——————————————————**/

/** @type {{ [key: string]: HTMLElement }} */
const itemModal = {};
itemModal.zone    = document.querySelector(".modal-zone.item-editor");
itemModal.modal   = itemModal.zone.querySelector(".modal");
itemModal.header  = itemModal.modal.querySelector(".header");
itemModal.body    = itemModal.modal.querySelector(".body");
itemModal.actions = itemModal.modal.querySelector(".modal-actions");
itemModal.delete  = itemModal.actions.querySelector(".delete");
itemModal.save    = itemModal.actions.querySelector(".save");
itemModal.cancel  = itemModal.actions.querySelector(".cancel");


const _category_enum = /** @enum */ {
  "private": -1,
  "key": -1,
  "rank": -1
}

/**
 * Vars
 * @type {{ category_index: string[], category_enum: _category_enum, [key: string]: any }}
*/
const itemVars = {};

itemVars.category_index = [ "private", "key", "rank" ];
itemVars.category_enum = itemVars.category_index.reduce((acc, curr, i) => {
  acc[curr] = i;
  return acc;
}, _category_enum);

// @ts-ignore
const tm_item_list_modal = document.querySelector("template#list-item").content.firstElementChild;

itemModal.cancel.addEventListener("click", CloseItemModal);

function ActivateItemModal() {
  itemModal.zone.classList.add("active");
}

/**
 * @param {ItemData} data
 * @param {string[]} actual_cmds
*/
function LoadCommandsOnItemModal(data, actual_cmds) {
  for(let [ command, i ] of ArrayIndex(GetItemCommands(data))) 
    NewCommandOnItemModal(command, i, actual_cmds);
}

/**
 * @param {string} msg
 * @param {string} title
*/
function ThrowBadRequestOnItemModal(msg, title) {
  alert("Bad request: " + msg);
  
  itemModal.save.classList.remove("disabled");
  itemModal.cancel.classList.remove("disabled");

  itemModal.header.innerHTML = title;
}

/**
 * @param {string[]} commands
 * @param {string} title
 * @returns {[boolean, [ string, string ]]}
*/
function EncodeCommands(commands, title) {
  const exec_cmd = [];
  const exec_params = [];
  
  for(let cmd of commands) {
    if(cmd === null) continue;
    
    const s = (/^([a-z0-9/_-]+)\s*(.*)$/i).exec(cmd);
    if(s === null) 
      return ThrowBadRequestOnItemModal("Commando no valido: " + cmd, title), [ false, [ "", "" ]];

    exec_cmd.push(s[1]);
    exec_params.push(s[2] || "");
  }

  return [ 
    true, 
    [ exec_cmd.join(" [&&] "), 
      exec_params.join(" [&&] ") ]
  ];
}

/**
 * @param {string} cmd
 * @param {number} index
 * @param {string[]} cmds_obj
 * @returns {HTMLElement}
*/
function NewCommandOnItemModal(cmd, index, cmds_obj) {
  const command_list = itemModal.body.querySelector("#commands-list")
  cmds_obj[index] = cmd;

  const elm = ElementFromNode(tm_item_list_modal.cloneNode(true));
  /**
   * @ignore
   * @type {HTMLInputElement}
  */
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

/**
 * @param {string[]} cmds
*/
function SetCommandActions(cmds) {
  /** @type {HTMLElement} */
  const command_list = itemModal.body.querySelector("#commands-list");

  if(!itemVars.cmd_add_btn)
    itemVars.cmd_add_btn = itemModal.body.querySelector("#command-add-btn");

  // Clear commands
  command_list.innerHTML = "";
  
  if(itemVars.cmd_fn)
    RemEvent("click", itemVars.cmd_add_btn, itemVars.cmd_fn);
  itemVars.cmd_fn = () => {
    NewCommandOnItemModal("", cmds.length, cmds).focus();
  }

  AddEvent("click", itemVars.cmd_add_btn, itemVars.cmd_fn)
}

/**
 * @param {[object, string]} property
 * @param {HTMLElement} elm
 * @param {string} _default
 * @param {(value: string) => any} [pre]
*/
function updateData(property, elm, _default, pre) {
  // @ts-ignore
  elm.value = _default;

  pre = pre || ((_) => _);

  if(itemVars[property[1]+"_ac_fn"])
    RemEvent("change", elm, itemVars[property[1]+"_ac_fn"]);

  itemVars[property[1]+"_ac_fn"] = () => {
    // @ts-ignore
    property[0][property[1]] = pre(elm.value);
  }

  AddEvent("change", elm, itemVars[property[1]+"_ac_fn"]);
}

/**
 * @param {[object, string]} property 
 * @param {HTMLSelectElement} elm
 * @param {number} [_default]
 * @param {(value: string) => any} [pre]
*/
function UpdateDataSelect(property, elm, _default, pre) {

  elm.selectedIndex = _default || 0;

  pre = pre || ((_) => _);
  property[0][property[1]] = pre(elm.value);

  if(itemVars[property[1]+"_ac_fn"])
    RemEvent("change", elm, itemVars[property[1]+"_ac_fn"]);

  itemVars[property[1]+"_ac_fn"] = () => {
    property[0][property[1]] = pre(elm.value);
  }

  AddEvent("change", elm, itemVars[property[1]+"_ac_fn"]);
}

function OpenAddModal() {
  /** @type {ItemData} */
  const actual_item_data = {
    uuid: "",
    name: "",
    description: "",
    price: 0,
    exec_cmd: "",
    exec_params: "",
    images: [],
    category: "",
    created: Date.now()
  };
  const actual_cmds = [];
  
  // Title of modal
  itemModal.header.innerHTML = "New item";
  itemModal.body
    .querySelector("#uuid")
    .classList.add("hidden");
  itemModal.delete.classList.add("hidden");

  // Fields of modal
  UpdateDataSelect([actual_item_data, "category"], itemModal.body.querySelector("#category"), 0);

  updateData([actual_item_data, "name"], itemModal.body.querySelector("#name"), "");

  updateData([actual_item_data, "price"], itemModal.body.querySelector("#price"), "0", parseFloat);

  updateData([actual_item_data, "description"], itemModal.body.querySelector("#description"), "");

  SetCommandActions(actual_cmds);
   

  async function save() {
    itemModal.save.classList.add("disabled");
    itemModal.cancel.classList.add("disabled");

    itemModal.header.innerHTML = "New item [SAVING]";
    
    const [ success, [ exec_cmd, exec_params ] ] = EncodeCommands(actual_cmds, "New Item");

    if(!success) return;
    
    try {
      await AddItem({
        uuid: "",
        name: actual_item_data.name,
        description: actual_item_data.description,
        price: actual_item_data.price,
        exec_cmd: exec_cmd,
        exec_params: exec_params,
        images: [],
        category: actual_item_data.category,
        created: actual_item_data.created
      });
    } catch(err) {
      alert(err);
      return;
    }
    
    await refreshItems();

    itemModal.save.classList.remove("disabled");
    itemModal.cancel.classList.remove("disabled");

    RemEvent("click", itemModal.save, save);
    CloseItemModal();
  };


  itemVars.save_fn = save;
  AddEvent("click", itemModal.save, save);
  ActivateItemModal();
}

/**
 * @param {ItemData} data
*/
function OpenItemModal(data) {
  /** @type {ItemData} */
  const actual_item_data = JSON.parse(JSON.stringify(data));
  const actual_cmds = [];
  
  // Title of modal
  itemModal.header.innerHTML = data.name;
  const uuid_s = itemModal.body.querySelector("#uuid");
  uuid_s.innerHTML = "UUID: " + data.uuid;
  uuid_s.classList.remove("hidden")
  itemModal.delete.classList.remove("hidden");

  // Fields of modal
  let image_selector_waiting = false;
  // @ts-ignore
  itemModal.body.querySelector("#image-selector").onclick = async () => {
    if(image_selector_waiting) return;
    image_selector_waiting = true;
    actual_item_data.images = await OpenImageModal(actual_item_data.images);
    image_selector_waiting = false;
  }

  UpdateDataSelect([actual_item_data, "category"], itemModal.body.querySelector("#category"), itemVars.category_enum[data.category]);

  updateData([actual_item_data, "name"], itemModal.body.querySelector("#name"), data.name);

  updateData([actual_item_data, "price"], itemModal.body.querySelector("#price"), data.price.toString(), parseFloat);

  updateData([actual_item_data, "description"], itemModal.body.querySelector("#description"), data.description);

  SetCommandActions(actual_cmds);
  LoadCommandsOnItemModal(data, actual_cmds); 

  async function save() {
    itemModal.save.classList.add("disabled");
    itemModal.cancel.classList.add("disabled");
    itemModal.header.innerHTML = data.name + " [SAVING]"; 
    const [ success, [ exec_cmd, exec_params ] ] = EncodeCommands(actual_cmds, data.name);
    if(!success) return;
    
    try {
      await UpdateItem({
        uuid: data.uuid,
        name: actual_item_data.name,
        description: actual_item_data.description,
        price: actual_item_data.price,
        exec_cmd: exec_cmd,
        exec_params: exec_params,
        images: [],
        category: actual_item_data.category,
        created: 0
      });
    } catch(err) {
      alert(err);
      return;
    }
    
    await refreshItems();

    itemModal.save.classList.remove("disabled");
    itemModal.cancel.classList.remove("disabled");

    RemEvent("click", itemModal.save, save);
    CloseItemModal();
  };

  async function _delete() {
    if(confirm("Are you sure?")) {
      if(await RemItem(data.uuid, prompt("Write: \"DELETE\""))) {
        CloseItemModal();
        refreshItems();
      }
    }
  }
  
  itemVars.save_fn   = save;
  itemVars.delete_fn = _delete;
  AddEvent("click", itemModal.save, save);
  AddEvent("click", itemModal.delete, _delete);
  ActivateItemModal();
}

function CloseItemModal() {
  itemModal.zone.classList.remove("active")
  RemEvent("click", itemModal.save, itemVars.save_fn);
  if(itemVars.delete_fn) {
    RemEvent("click", itemModal.delete, itemVars.delete_fn);
    itemVars.delete_fn = undefined;
  }
}


/*********** Image selector modal ***********/

/** @type {{ [key: string]: HTMLElement }} */
const imageModal = {};
imageModal.zone = document.querySelector(".modal-zone#image-selector");
imageModal.modal = imageModal.zone.querySelector(".modal");
imageModal.header = imageModal.modal.querySelector(".header");
imageModal.body = imageModal.modal.querySelector(".body");
imageModal.actions = imageModal.modal.querySelector(".modal-actions");
imageModal.save = imageModal.actions.querySelector(".cancel");
imageModal.cancel = imageModal.actions.querySelector(".save");

/** @type {{ [key: string]: any }} */
const imageVars = {};

/**
 * @param {string[]} selected
 * @returns {Promise<string[]>}
*/
function OpenImageModal(selected) {
  return new Promise(res => {
    //const actual_images = selected.slice(0);

    ImageModal_SupEvent(imageModal.cancel, "click", "cancel_ac_fn", () => {
      itemModal.zone.classList.remove("active");
      res(selected);
    })
  });
}

/**
 * @param {HTMLElement} elm
 * @param {string} evt
 * @param {string} property
 * @param {Function} fn
*/
function ImageModal_SupEvent(elm, evt, property, fn) {
  if(imageVars[property]) 
    RemEvent(evt, elm, imageVars[property]);

  imageVars[property] = fn;
  AddEvent(evt, elm, imageVars[property]);
}


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
  AddEvent(
    ev, 
    parent.querySelector(selector), 
    fn
  );
}

/**
 * @param {string} ev
 * @param {Element} elm
 * @param {(event?: Event) => void} fn
*/
function AddEvent(ev, elm, fn) {
  elm.addEventListener(ev, fn)
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

  if(cmds.length === 1 && cmds[0].match(/^\s*$/))
    return [];

  return new Array(cmds.length)
    .fill(0)
    .map((_, i) => {
      return cmds[i] + " " + params[i];
    });
}

/**
 * @param {ArrayLike<any>} arr
 * @returns {Generator<[any, number]>}
*/
function* ArrayIndex(arr) {
  for(let i = 0; i < arr.length; i++) {
    yield [arr[i], i];
  }
}

/**
 * @param {ItemData} data
*/
function PrePostItem(data) {
  if(data.name.length > 30)
    throw new RangeError("Name is very long. Max 30.");
  if(data.price < 0)
    throw new RangeError("Price is negative. only accept positive");
}

/**
 * @param {ItemData} data
 * @returns {Promise<boolean>}
 */
async function UpdateItem(data) {
  PrePostItem(data);
  const res = await fetch("/api/update/product", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if(res.status === 500)
    return (alert("Error updating product: " + (await res.json())?.error), true), false;
  return true;
}

/**
 * @param {ItemData} data,
 * @returns {Promise<boolean>}
 */
async function AddItem(data) {
  PrePostItem(data);
  const res = await fetch("/api/add/product", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if(!res.ok)
    return alert("Error adding item."), false;
  
  return true;
}

/**
 * @param {string} uuid
 * @param {string} confirmation
*/
async function RemItem(uuid, confirmation) {
  const res = await fetch("/api/delete/product",{
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uuid,
      confirmation
    })
  });
  
  if(res.status === 400) {
    alert("Invalid confirmation.");
    return false;
  }

  if(!res.ok) {
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
    cache: "no-cache"
  });

  if(!res.ok)
    alert("Error fetching products data.");

  /** @type {ItemData[]} */
  const json = await res.json();

  cache_ordened_uuid = [];
  
  cache_items = json.reduce((obj, item) => {
    obj[item.uuid] = item;
    cache_ordened_uuid.push(item.uuid);
    return obj;
  }, {});

  cache_ordened_uuid.sort((a, b) => {
    return cache_items[a].created - cache_items[b].created;
  });

  return cache_items;
}

