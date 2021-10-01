
import Modal from "../../components/modal.js";
import Select from "../../components/select.js";
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

  await wait(500);
  alert("Not implemented");

  header_action.filter.classList.remove("anim");
  filterAction_isRunning = false;
};

let addAction_isRunning = false;
header_action.add.onclick = async () => {
  if(addAction_isRunning) return;
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

  elm.addEventListener("click", () => {
    OpenItemModal(data);
  });

  return elm;
}

/**——————————————————**/
/**       MODAL      **/
/**——————————————————**/

const modalItem_events = {
  /** @param {Modal} _ */
  _delete: (_) => {},
  /** @param {Modal} _ */
  _save:   (_) => {}
};

const modalItem_Vars = {};

/** @type {HTMLDivElement} */
const modalItem_body = document.querySelector("#item-editor-body");

const modalItem = new Modal({
  title: "Loading...",
  headerStyle: Modal.HeaderStyle.Solid,
  body: modalItem_body,
  cloneBody: true,
  actions: [
    { name: "Delete",
      color: Modal.ActionColor.Danger,
      onClick: (modal) => { 
        modalItem_events._delete(modal);
      } },
    { name: "Cancel",
      onClick: (modal) => {
        modal.drainEvents();
        modal.close();
      } },
    { name: "Save",
      onClick: (modal) => {
        modalItem_events._save(modal);
      } }
  ]
});

const categorySelect = new Select({
  // @ts-ignore
  dom: modalItem.getBody()._.category._.select.dom,
  options: [
    ["Private", "private"],
    ["Key", "key"],
    ["Rank", "rank"]
  ],
  selected: "private"
});

// @ts-ignore
const tm_item_list_modal = document.querySelector("template#list-item").content.firstElementChild;


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
  
  modalItem.getActions()._.Save.classes.remove("disabled");
  modalItem.getActions()._.Cancel.classes.remove("disabled");

  modalItem.setHeader(title);
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
  const command_list = modalItem.getBody()._.commands._.list.dom;
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
  const command_list = modalItem.getBody()._.commands._.list.dom;

  const addBtn = modalItem.getBody()._.commands._.header._.actions._.button.dom;

  // Clear commands
  command_list.innerHTML = "";
  
  if(modalItem_Vars.cmd_fn)
    RemEvent("click", addBtn, modalItem_Vars.cmd_fn);
  modalItem_Vars.cmd_fn = () => {
    NewCommandOnItemModal("", cmds.length, cmds).focus();
  }

  AddEvent("click", addBtn, modalItem_Vars.cmd_fn)
}

/**
 * @param {[object, string]} property
 * @param {import("../../common/html").json_html<HTMLInputElement>} elm
 * @param {string} _default
 * @param {(value: string) => any} [pre]
 */
function UpdateData(property, elm, _default, pre) {
  elm.dom.value = _default;
  pre = pre || ((_) => _);
  property[0][property[1]] = _default;

  elm.events.add("change", () => {
    property[0][property[1]] = pre(elm.dom.value);
  });
}

/**
 * @param {[object, string]} property 
 * @param {import("../../common/html").json_html<HTMLSelectElement>} elm
 * @param {Select} select
 * @param {number | string} [_default]
 * @param {(value: string) => any} [pre]
 */
function UpdateDataSelect(property, elm, select, _default, pre) {
  pre = pre || (_ => _);

  if(typeof _default !== "undefined") {
    select.select(_default);
  }

  property[0][property[1]] = pre(select.selectedValue);

  elm.events.add("change", () => {
    property[0][property[1]] = pre(select.selectedValue);
  });
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

  const body = modalItem.getBody();
  
  // Title of modal
  modalItem.setHeader("New Item");
  body._.uuid.classes.add("hidden");
  modalItem.getActions()._.Delete.classes.add("hidden");

  // Fields of modal
    // @ts-ignore
  UpdateDataSelect([actual_item_data, "category"], body._.category._.select, categorySelect, "private");
    
    // @ts-ignore
  UpdateData([actual_item_data, "name"], body._.name._.input, "");

    // @ts-ignore
  UpdateData([actual_item_data, "price"], body._.price._.input, "0", parseFloat);

    // @ts-ignore
  UpdateData([actual_item_data, "description"], body._.description._.textarea, ""); 

  SetCommandActions(actual_cmds);
  
  /** @type {Modal} modal */
  modalItem_events._save = async (modal) => {
    modal.disableActions();
    modal.setHeader("New item [SAVING]");
    
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
      console.error(err);
      return;
    }
    
    await refreshItems();

    modal.undisableActions();
    modal.close();
    modal.drainEvents();
  };

  modalItem.open();
}

/**
 * @param {ItemData} data
 */
function OpenItemModal(data) {
  /* @type {ItemData} */
  const actual_item_data = JSON.parse(JSON.stringify(data));
  const actual_cmds = [];

  const body = modalItem.getBody();
  
  // Title of modal
  modalItem.setHeader(data.name);
  const uuid_s = body._.uuid;
  uuid_s.dom.innerHTML = "UUID: " + data.uuid;
  uuid_s.classes.remove("hidden")
  modalItem.getActions()._.Delete.classes.remove("hidden");

  // Fields of modal
  let image_selector_waiting = false;
  
  body._.image._.button.events.add("click", async () => {
    if(image_selector_waiting) return;
    image_selector_waiting = true;
    actual_item_data.images = await OpenImageModal(actual_item_data.images);
    image_selector_waiting = false;
  });

  // @ts-ignore
  UpdateDataSelect([actual_item_data, "category"], body._.category._.select, categorySelect, data.category);

  // @ts-ignore
  UpdateData([actual_item_data, "name"], body._.name._.input, data.name);

  // @ts-ignore
  UpdateData([actual_item_data, "price"], body._.price._.input, data.price.toString(), parseFloat);

  // @ts-ignore
  UpdateData([actual_item_data, "description"], body._.description._.textarea, data.description);

  SetCommandActions(actual_cmds);
  LoadCommandsOnItemModal(data, actual_cmds); 

  /** @param {Modal} modal */
  modalItem_events._save = async (modal) => {
    modal.disableActions();

    modal.setHeader(data.name + " [SAVING]");
    
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
        images: actual_item_data.images,
        category: actual_item_data.category,
        created: 0
      });
    } catch(err) {
      alert(err);
      return;
    }
    
    await refreshItems();

    modal.undisableActions();
    modal.drainEvents();
    modal.close();
  };

  /** @param {Modal} modal */
  modalItem_events._delete = async (modal) => {
    if(confirm("Are you sure?")) {
      if(await RemItem(data.uuid, prompt("Write: \"DELETE\""))) {
        modal.close();
        refreshItems();
      }
    }
  }

  modalItem.open();
}


/*********** Image selector modal ***********/

/**
 * @typedef {{ uuid: string, name: string, image: string, created: number }} imageData
*/

const imageModal_body = document.querySelector("#image-selector");

const imageModal_events = {
  /** @param {Modal} _ */
  _save: (_) => {},
  /** @param {Modal} _ */
  _close: (_) => {}
}

const imageModal = new Modal({
  title: "Image Selector",
  headerStyle: Modal.HeaderStyle.Outline,
  // @ts-ignore
  body: imageModal_body,
  cloneBody: true,
  actions: [
    { name: "Cancel",
      onClick: (modal) => {
        imageModal_events._close(modal);
      } },
    { name: "Save",
      onClick: (modal) => {
        imageModal_events._save(modal);
      } }
  ]
});

/**
 * @param {string[]} selected
 * @returns {Promise<string[]>}
 */
function OpenImageModal(selected) {
  return new Promise(async res => {
    const actual_images = selected.slice(0);

    let imageList_crude;
    let imageList;

    const body = imageModal.getBody();
    const selectorList = body._.images.dom;

    await refreshImages();

    /** @type {import("../../common/html").json_html<HTMLInputElement>} */
    // @ts-ignore
    const fileInput = body._.upload._.input;

    body._.upload._.button.events.add("click", ()=>{
      fileInput.dom.click();
    });

    fileInput.events.add("change", async () => {
      const form = new FormData();
      form.append("total", fileInput.dom.files.length.toFixed(0));

      for(const file of fileInput.dom.files) {
        form.append(`images`, file);
      }

      fetch("/api/staff/images", {
        method: "POST",
        body: form
      }).then(() => refreshImages());
    });
    
    imageModal_events._close = (modal) => {
      modal.drainEvents();
      modal.close();
      res(selected);
    };

    imageModal_events._save = (modal) => {
      modal.drainEvents();
      modal.close();
      res(actual_images);
    }

    imageModal.open();

    async function refreshImages() {
      imageList_crude = await GetImages();
      if(imageList_crude === null)
        return;
      imageList = imageList_crude.map(image => {
        const dom = imageModal_image(image, actual_images);
        
        dom.addEventListener("click", () => {
          const i = actual_images.indexOf(image.uuid);
          if(i !== -1) {
            actual_images.splice(i, 1);
          } else {
            actual_images.push(image.uuid);
          }

          dom.classList.toggle("selected");
        });

        return dom;
      });
      
      selectorList.innerHTML = "";
      selectorList.append(...imageList);

      body._.upload._.span._.span.dom.innerText = imageList_crude.length.toString();
    }
  })
}

/*
<div class="image selected" >
  <img src="/img/logo-128x.png" >
</div>
*/

/**
 * @param {imageData} data
 * @param {string[]} selected
*/
function imageModal_image(data, selected) {
  const div = document.createElement("div");

  div.className = "image";

  if(selected.includes(data.uuid))
    div.classList.add("selected");

  div.append(newImage(data.image));

  return div;
}

/**
 * @param {string} src
 * @param {number} [width]
 * @param {number} [height]
 * @returns {HTMLImageElement}
*/
function newImage(src, width, height) {
  const img = new Image(width, height);
  img.src = src;
  return img;
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
 * @returns {Promise<imageData[]>} 
*/
async function GetImages() {
  const res = await fetch("/api/staff/images", {
    credentials: "same-origin"
  });

  if(!res.ok) {
    alert("Error fetching images.");
    console.log(res);
    return null;
  }

  return await res.json();
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
