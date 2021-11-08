import Modal from "../../../components/modal.js";
import Select from "../../../components/select.js";
import ElementList from "../../../components/list/list.js";
import { createElement, json_html } from "../../../common/html.js";
import {
  monetize,
  wait,
  capitalize,
  applyFilter,
} from "../../../common/shop.js";

import { query as querySelector } from "../../../common/html.js";

enum UserRank {
  "Default" = 1,
  "User" = 2,
  "Partner" = 3,
  "Staff" = 4,
  "Builder" = 5,
  "Dev" = 6,
  "Soporte" = 7,
  "Mod" = 8,
  "Admin" = 9,
  "Owner" = 10,
}

interface Category {
  uuid: string;
  name: string;
  display: string;
  description: string;
  public: number;
  image: string;
  min_rank: UserRank;
  order: string[];
}

interface ItemData {
  uuid: string;
  name: string;
}

// const filters = {
//   created: 1,
//   price: 0,
//   name: 0,
//   category: ".*",
//   sale: 0
// }

let cacheProducts: ItemData[];

const header_actions_div: HTMLDivElement = querySelector<HTMLDivElement>(
  ".app .header .actions"
);

const categories_list: HTMLDivElement =
  querySelector<HTMLDivElement>(".app .categories");

const category_template: HTMLTemplateElement =
  querySelector<HTMLTemplateElement>("template#category");

const category_list = new ElementList<Category, HTMLDivElement>(
  categories_list,
  "/api/shop/categories",
  { idTarget: "uuid" }
)
  .setTemplate(<HTMLDivElement>category_template.content.firstElementChild)
  .on(
    ElementList.Events.TemplateClick,
    (_, elm: HTMLDivElement, data: Category) => {
      console.log("FF");
      
      OpenCategoryModal(data);
    }
  );

const header_action = {
  refresh: querySelector<HTMLButtonElement>(".refresh", header_actions_div),
  filter: querySelector<HTMLButtonElement>(".filter", header_actions_div),
  add: querySelector<HTMLButtonElement>(".add", header_actions_div),
};

const refreshAction_fn = async () => {
  if (category_list.isLoading) return;
  header_action.refresh.classList.add("anim");
  await Promise.all([wait(1000), category_list.refresh()]);
  header_action.refresh.classList.remove("anim");
};
header_action.refresh.onclick = refreshAction_fn;

let filterAction_isRunning = false;
header_action.filter.onclick = async () => {
  if (filterAction_isRunning) return;
  filterAction_isRunning = true;
  header_action.filter.classList.add("anim");

  await wait(1000);
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

refreshAction_fn();

/**——————————————————**/
/**       MODAL      **/
/**——————————————————**/

const modalCategory_events = {
  _delete: (_: Modal) => {},
  _save: (_: Modal) => {},
};

const modalCategory_Vars: {
  ctg_fn?: () => void;
} = {};

const modalCategory_body = querySelector<HTMLDivElement>(
  "#category-editor-body"
);

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

const rankSelect: Select = new Select({
  dom: <HTMLSelectElement>modalCategory.getBody()._.rank._.select.dom,
  options: Object.keys(UserRank).filter((_) => typeof UserRank[_] === "number"),
});

const tmCategoryListModal = <HTMLDivElement>(
  querySelector<HTMLTemplateElement>("template#list-category").content
    .firstElementChild
);

// /**
//  * @param {string} msg
//  * @param {string} title
// */
// function ThrowBadRequestOnItemModal(msg, title) {
//   alert("Bad request: " + msg);

//   modalCategory.getActions()._.Save.classes.remove("disabled");
//   modalCategory.getActions()._.Cancel.classes.remove("disabled");

//   modalCategory.setHeader(title);
// }

function NewOrderOnItemModal(
  order: string,
  index: number,
  order_obj: string[]
): HTMLInputElement {
  const order_list = modalCategory.getBody()._.orders._.list.dom;
  order_obj[index] = order;

  const elm = <HTMLDivElement>tmCategoryListModal.cloneNode(true);

  const inpZone = querySelector(".input-zone", elm);
  const name = querySelector(".name", inpZone);

  const inp = querySelector<HTMLInputElement>("input", inpZone);
  inp.setAttribute("list", "products_list");

  inp.value = order;
  if (inp.value.length > 0) {
    inpZone.classList.remove("blank");
    if (inp.value.length !== 36) {
      name.innerText = "Invalid";
    } else {
      name.innerText =
        cacheProducts.find((_: ItemData) => _.uuid === inp.value)?.name ||
        "Invalid";
    }
  } else {
    inpZone.classList.add("blank");
  }
  AddEvent("input", inp, () => {
    order_obj[index] = inp.value;
    if (inp.value.length > 0) {
      inpZone.classList.remove("blank");
      if (inp.value.length !== 36) {
        name.innerText = "Invalid";
      } else {
        name.innerText =
          cacheProducts.find((_: ItemData) => _.uuid === inp.value)?.name ||
          "Invalid";
      }
    } else {
      inpZone.classList.add("blank");
    }
  });

  AddEventChild("click", elm, ".delete", () => {
    order_obj.splice(index, 1);
    elm.remove();
  });

  AddEventChild("click", elm, ".up", () => {
    if (index === 0) return;
    const [tmp] = order_obj.splice(index, 1);
    order_obj.splice(index - 1, 0, tmp);
    LoadProductsOnCategoryModal(order_obj);
  });

  AddEventChild("click", elm, ".down", () => {
    if (index === order_obj.length - 1) return;
    const [tmp] = order_obj.splice(index, 1);
    order_obj.splice(index + 1, 0, tmp);
    LoadProductsOnCategoryModal(order_obj);
  });

  order_list.append(elm);

  return inp;
}

function SetOrderActions(order: string[]) {
  const order_list = modalCategory.getBody()._.orders._.list.dom;

  const addBtn =
    modalCategory.getBody()._.orders._.header._.actions._.button.dom;

  // Clear orders
  order_list.innerHTML = "";

  if (modalCategory_Vars.ctg_fn)
    RemEvent("click", addBtn, modalCategory_Vars.ctg_fn);

  modalCategory_Vars.ctg_fn = () => {
    NewOrderOnItemModal("", order.length, order).focus();
  };

  AddEvent("click", addBtn, modalCategory_Vars.ctg_fn);
}

function UpdateData(
  property: [object, string],
  elm: json_html<HTMLInputElement>,
  _default: string,
  pre?: (value: string, element: json_html<HTMLInputElement>) => any
) {
  elm.dom.value = _default;
  pre = pre || ((_) => _);
  property[0][property[1]] = pre(_default, elm);

  elm.events.add("input", () => {
    property[0][property[1]] = pre(elm.dom.value, elm);
  });
}

function UpdateDataSelect(
  property: [object, string],
  elm: json_html<HTMLSelectElement>,
  select: Select,
  _default: number | string,
  pre?: (value: string, element: json_html<HTMLSelectElement>) => any
) {
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
  const actual_category_data: Category = {
    uuid: "",
    name: "",
    display: "{{NAME}}",
    description: "",
    public: 1,
    image: "",
    min_rank: UserRank.Default,
    order: [],
  };
  const actual_order: string[] = actual_category_data.order;

  const body = modalCategory.getBody();

  // Title of modal
  modalCategory.setHeader("New Category");
  body._.uuid.classes.add("hidden");
  modalCategory.getActions()._.Delete.classes.add("hidden");

  // Fields of modal

  UpdateData(
    [actual_category_data, "name"],
    <json_html<HTMLInputElement>>body._.name._.input,
    ""
  );

  UpdateData(
    [actual_category_data, "display"],
    <json_html<HTMLInputElement>>body._.display._.input,
    "{{NAME}}"
  );
  const updateDisplay = () => {
    body._.display._.preview.dom.innerHTML = (<HTMLInputElement>(
      body._.display._.input.dom
    )).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
  };
  body._.display._.input.events.add("input", updateDisplay);
  body._.name._.input.events.add("input", updateDisplay);

  UpdateData(
    [actual_category_data, "description"],
    <json_html<HTMLInputElement>>body._.description._.textarea,
    ""
  );

  UpdateData(
    [actual_category_data, "public"],
    <json_html<HTMLInputElement>>body._.show._.input,
    "",
    (_, elm) => (elm.dom.checked ? 1 : 0)
  );

  UpdateDataSelect(
    [actual_category_data, "min_rank"],
    <json_html<HTMLSelectElement>>body._.rank._.select,
    rankSelect,
    0,
    (value: string) => UserRank[value]
  );

  SetOrderActions(actual_order);

  modalCategory_events._save = async (modal: Modal) => {
    modal.disableActions();
    modal.setHeader("New category [SAVING]");

    try {
      await AddCategory({
        uuid: "",
        name: actual_category_data.name,
        display: actual_category_data.display,
        description: actual_category_data.description,
        image: actual_category_data.image,
        min_rank: actual_category_data.min_rank,
        order: actual_category_data.order,
        public: actual_category_data.public,
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

  modalCategory.open();
}

function OpenCategoryModal(data: Category) {
  const actual_category_data: Category = JSON.parse(JSON.stringify(data));
  const actual_order: string[] = actual_category_data.order;

  const body = modalCategory.getBody();

  // Title of modal
  modalCategory.setHeader(data.name);
  const uuid_s = body._.uuid;
  uuid_s.dom.innerHTML = "UUID: " + data.uuid;
  uuid_s.classes.remove("hidden");
  modalCategory.getActions()._.Delete.classes.remove("hidden");

  // Fields of modal
  let image_selector_waiting = false;

  body._.image._.button.events.add("click", async () => {
    if (image_selector_waiting) return;
    image_selector_waiting = true;
    // actual_item_data.images = await OpenImageModal(actual_item_data.images);
    image_selector_waiting = false;
  });

  UpdateData(
    [actual_category_data, "name"],
    <json_html<HTMLInputElement>>body._.name._.input,
    ""
  );

  UpdateData(
    [actual_category_data, "display"],
    <json_html<HTMLInputElement>>body._.display._.input,
    "{{NAME}}"
  );
  const updateDisplay = () => {
    body._.display._.preview.dom.innerHTML = (<HTMLInputElement>(
      body._.display._.input.dom
    )).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
  };
  body._.display._.input.events.add("input", updateDisplay);
  body._.name._.input.events.add("input", updateDisplay);

  UpdateData(
    [actual_category_data, "description"],
    <json_html<HTMLInputElement>>body._.description._.textarea,
    ""
  );

  UpdateData(
    [actual_category_data, "public"],
    <json_html<HTMLInputElement>>body._.show._.input,
    "",
    (_, elm) => (elm.dom.checked ? 1 : 0)
  );

  UpdateDataSelect(
    [actual_category_data, "min_rank"],
    <json_html<HTMLSelectElement>>body._.rank._.select,
    rankSelect,
    0,
    (value: string) => UserRank[value]
  );

  SetOrderActions(actual_order);
  LoadProductsOnCategoryModal(actual_order);

  /** @param {Modal} modal */
  modalCategory_events._save = async (modal) => {
    modal.disableActions();

    modal.setHeader(data.name + " [SAVING]");

    try {
      // await UpdateItem({
      //   uuid: data.uuid,
      //   name: actual_item_data.name,
      //   description: actual_item_data.description,
      //   price: actual_item_data.price,
      //   exec_cmd: exec_cmd,
      //   exec_params: exec_params,
      //   images: actual_item_data.images,
      //   category: actual_item_data.category,
      //   created: 0,
      // });
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
  modalCategory_events._delete = async (modal) => {
    if (confirm("Are you sure?")) {
      // if (await RemItem(data.uuid, prompt('Write: "DELETE"'))) {
      //   modal.close();
      //   refreshAction_fn();
      // }
    }
  };

  modalCategory.open();
}

// /**
//  * @param {string} ev
//  * @param {Element} elm
//  * @param {(event?: Event) => void} fn
// */
// function RemEvent(ev, elm, fn) {
//   elm.removeEventListener(ev, fn);
// }

// /**
//  * AddEvent(#ev, #parent.querySelector(#selector), fn);
//  * @param {string} ev
//  * @param {Element} parent
//  * @param {string} selector
//  * @param {(event?: Event) => void} fn
// */
// function AddEventChild(ev, parent, selector, fn) {
//   AddEvent(
//     ev,
//     parent.querySelector(selector),
//     fn
//   );
// }

// /**
//  * @param {string} ev
//  * @param {Element} elm
//  * @param {(event?: Event) => void} fn
// */
// function AddEvent(ev, elm, fn) {
//   elm.addEventListener(ev, fn)
// }

function RemEvent(ev: string, elm: HTMLElement, fn: (e?: Event) => void) {
  elm.removeEventListener(ev, fn);
}

/**
 * AddEvent(#ev, #parent.querySelector(#selector), fn);
 */
function AddEventChild(
  ev: string,
  parent: HTMLElement,
  selector: string,
  fn: (e?: Event) => void
) {
  AddEvent(ev, parent.querySelector(selector), fn);
}

function AddEvent(ev: string, elm: HTMLElement, fn: (e?: Event) => void) {
  elm.addEventListener(ev, fn);
}

function LoadProductsOnCategoryModal(actual: string[]) {
  for (let [product, i] of ArrayIndex<string>(actual)) {
    NewOrderOnItemModal(product, i, actual);
  }
}

function* ArrayIndex<T extends any = any>(arr: T[]): Generator<[T, number]> {
  modalCategory.getBody()._.orders._.list.dom.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    yield [arr[i], i];
  }
}

function PrePostItem(data: Category) {
  if (data.name.length > 20) throw new RangeError("Name is very long. Max 30.");
}

// /**
//  * @returns {Promise<imageData[]>}
// */
// async function GetImages() {
//   const res = await fetch("/api/staff/images", {
//     credentials: "same-origin"
//   });

//   if(!res.ok) {
//     alert("Error fetching images.");
//     console.log(res);
//     return null;
//   }

//   return await res.json();
// }

// /**
//  * @param {ItemData} data
//  * @returns {Promise<boolean>}
//  */
// async function UpdateItem(data) {
//   PrePostItem(data);
//   const res = await fetch("/api/update/product", {
//     method: "POST",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });

//   if(res.status === 500)
//     return (alert("Error updating product: " + (await res.json())?.error), true), false;
//   return true;
// }

async function AddCategory(data: Category) {
  PrePostItem(data);
  const res = await fetch("/api/shop/category", {
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

// /**
//  * @param {string} uuid
//  * @param {string} confirmation
// */
// async function RemItem(uuid, confirmation) {
//   const res = await fetch("/api/delete/product",{
//     method: "POST",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       uuid,
//       confirmation
//     })
//   });

//   if(res.status === 400) {
//     alert("Invalid confirmation.");
//     return false;
//   }

//   if(!res.ok) {
//     alert("Error deleting item.");
//     return false;
//   }

//   return true;
// }

/**************************/
/***    Product List    ***/
/**************************/

(async () => {
  const list = querySelector<HTMLDataListElement>("#products_list");
  const res = await fetch("/api/get/products", {
    headers: {
      accept: "application/json",
    },
    credentials: "same-origin",
  });

  if (!res.ok) return;
  cacheProducts = await res.json();

  list.innerHTML = "";

  for (const product of cacheProducts) {
    const elm = createElement<HTMLOptionElement>("option");
    elm.value = product.uuid;
    elm.text = product.name;
    list.append(elm);
  }
})();
