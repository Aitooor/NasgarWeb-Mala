/// <reference path="../../../../../../node_modules/@types/simplemde/index.d.ts" />
import Modal from "../../../components/modal.js";
import Select from "../../../components/select.js";
import ElementList from "../../../components/list/list.js";
import { jsonHtml, queryAll } from "../../../common/html.js";
import { monetize, wait } from "../../../common/shop.js";
import { RecomendedSelectorList } from "../../../components/selector_list/selectorList.js";

import { query as querySelector } from "../../../common/html.js";
import { OrdenedElementList } from "../../../components/list/order.js";

const SimpleMDE = window.SimpleMDE;

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
  image: string;
  min_rank: UserRank;
  order: string[];
  subcategories: string[];
}

interface Product {
  uuid: string;
  name: string;
  category: string;
}

// const filters = {
//   created: 1,
//   price: 0,
//   name: 0,
//   category: ".*",
//   sale: 0
// }

let cacheProducts: Product[];

const header_actions_div: HTMLDivElement = querySelector<HTMLDivElement>(
  ".app .header .actions"
);

//#region Categories list
const categories_list: HTMLDivElement =
  querySelector<HTMLDivElement>(".app .categories");

const category_template: HTMLTemplateElement =
  querySelector<HTMLTemplateElement>("template#category");

const category_list = new ElementList<Category, HTMLDivElement>(
  categories_list,
  "/api/shop/categories",
  { idTarget: "uuid" }
)
  .setOrderByFunction((a, b) => {
    return a.name.localeCompare(b.name);
  })
  .setTemplate(<HTMLDivElement>category_template.content.firstElementChild)
  .setOnClick((_, elm: HTMLDivElement, data: Category) => {
    OpenCategoryModal(data);
  });
//#endregion

//#region Header actions
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
//#endregion

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

const rankSelect: Select = new Select({
  dom: <HTMLSelectElement>modalCategory.getBody()._.rank._.select.dom,
  options: Object.keys(UserRank).filter((_) => typeof UserRank[_] === "number"),
});

//#region Product list
const productsList = new OrdenedElementList<Product>(
  document.querySelector("#product_list"),
  OrdenedElementList.NO_URL,
  {
    autoRefresh: true,
    idTarget: "uuid",
  }
).setCustomFunctions({
  inputFn: (ctx: any) => {
    const inpZone = querySelector(".input-zone", ctx.template);
    const name = querySelector(".name", inpZone);

    const value: string = ctx.element.value;
    if (value.length > 0) {
      inpZone.classList.remove("blank");
      if (value.length !== 36) {
        name.innerText = "Invalid";
      } else {
        name.innerText =
          cacheProducts.find((_: Product) => _.uuid === value)?.name ||
          "Invalid";
      }
    } else {
      inpZone.classList.add("blank");
    }

    const index = ctx.list.getIndex(ctx.data);
    if (
      index !== -1 &&
      cacheProducts.find((_: Product) => _.uuid === value) !== undefined
    ) {
      ctx.data.uuid = value;
    } else {
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

const productsListSelector = new RecomendedSelectorList<Product>({
  list: [],
  hint:
    "Use " +
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

function SetOrderActions(order: string[]) {
  const addBtn =
    modalCategory.getBody()._.orders._.header._.actions._.button.dom;
  
  AddEvent("click", addBtn, () => {
    productsList.add({ uuid: "", name: "", category: "" });
    const childs: HTMLInputElement[] = <HTMLInputElement[]>(
      Array.from(
        queryAll<HTMLInputElement>(
          ".input-zone input",
          modalCategory.getBody()._.orders._.list.dom
        )
      )
    );

    productsListSelector.setTarget(childs);
    productsListSelector.setOnSelect((item: Product, i: number) => {
      childs[i].value = item.uuid;
      childs[i].dispatchEvent(
        new Event("input", { bubbles: true, cancelable: true })
      );
    });
  });

  productsList.clearPipes();
  productsList.pipe((method: string) => {
    if (method !== "custom:change") return;
    order.splice(0, order.length);
    order.push(...productsList.getData().map((v) => v.uuid));
  });
}

function LoadProductsOnCategoryModal(actual: string[]) {
  productsList.deleteAll();
  for (let [product, i] of ArrayIndex<string>(actual)) {
    const prod: Product = cacheProducts.find(
      (_: Product) => _.uuid === product
    );
    const name = prod?.name || "";
    const category = prod?.category || "";
    productsList.add({ uuid: product, name: name, category: category });

    const childs: HTMLElement[] = <HTMLElement[]>(
      Array.from(
        queryAll<HTMLInputElement>(
          ".input-zone input",
          modalCategory.getBody()._.orders._.list.dom
        )
      )
    );

    productsListSelector.setTarget(childs);
  }
}
//#endregion

//#region Subcategory list
interface CategoryOnList {
  uuid: string;
  name: string;
}

const categoriesList = new OrdenedElementList<CategoryOnList>(
  document.querySelector("#category_list"),
  OrdenedElementList.NO_URL,
  {
    autoRefresh: true,
    idTarget: "uuid",
  }
).setCustomFunctions({
  inputFn: (ctx: any) => {
    const inpZone = querySelector(".input-zone", ctx.template);
    const name = querySelector(".name", inpZone);

    const value: string = ctx.element.value;
    if (value.length > 0) {
      inpZone.classList.remove("blank");
      if (value.length !== 36) {
        name.innerText = "Invalid";
      } else {
        name.innerText =
          category_list.getData().find((_: CategoryOnList) => _.uuid === value)
            ?.name || "Invalid";
      }
    } else {
      inpZone.classList.add("blank");
    }

    const index = ctx.list.getIndex(ctx.data);
    if (
      index !== -1 &&
      category_list.getData().find((_: CategoryOnList) => _.uuid === value) !==
        undefined
    ) {
      ctx.data.uuid = value;
    } else {
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

const categoriesListSelector = new RecomendedSelectorList<CategoryOnList>({
  list: [],
  hint:
    "Use " +
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

function SetOrderCategories(order: string[]) {
  const addBtn =
    modalCategory.getBody()._.categories._.header._.actions._.button.dom;

  categoriesListSelector.setList(category_list.getData());

  AddEvent("click", addBtn, () => {
    categoriesList.add({ uuid: "", name: "" });
    const childs: HTMLInputElement[] = <HTMLInputElement[]>(
      Array.from(
        queryAll<HTMLInputElement>(
          ".input-zone input",
          modalCategory.getBody()._.categories._.list.dom
        )
      )
    );

    categoriesListSelector.setTarget(childs);
    categoriesListSelector.setOnSelect((item: CategoryOnList, i: number) => {
      console.log(item);

      childs[i].value = item.uuid;
      childs[i].dispatchEvent(
        new Event("input", { bubbles: true, cancelable: true })
      );
    });
  });
  categoriesList.clearPipes();
  categoriesList.pipe((method: string) => {
    if (method !== "custom:change") return;
    order.splice(0, order.length);
    order.push(...categoriesList.getData().map((v) => v.uuid));
  });
}

function LoadCategoriesOnCategoryModal(actual: string[]) {
  categoriesList.deleteAll();
  for (let [category, i] of ArrayIndex<string>(actual)) {

    const prod: CategoryOnList | undefined = category_list
      .getData()
      .find((_: Category) => _.uuid === category);
    const name = prod?.name || "";
    categoriesList.add({ uuid: category, name: name });

    const childs: HTMLElement[] = <HTMLElement[]>(
      Array.from(
        queryAll<HTMLInputElement>(
          ".input-zone input",
          modalCategory.getBody()._.categories._.list.dom
        )
      )
    );

    categoriesListSelector.setTarget(childs);
  }
}
//#endregion

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

function UpdateDataSelect(
  property: [object, string],
  elm: jsonHtml<HTMLSelectElement>,
  select: Select,
  _default: number | string,
  pre?: (value: string, element: jsonHtml<HTMLSelectElement>) => any
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
    image: "",
    min_rank: UserRank.Default,
    order: [],
    subcategories: [],
  };
  const actual_order: string[] = actual_category_data.order;
  const actual_subcategories: string[] = actual_category_data.subcategories;

  const body = modalCategory.getBody();

  // Title of modal
  modalCategory.setHeader("New Category");
  body._.uuid.classes.add("hidden");
  modalCategory.getActions()._.Delete.classes.add("hidden");

  updateMDE.value(" ")

  // Fields of modal

  UpdateData(
    [actual_category_data, "name"],
    <jsonHtml<HTMLInputElement>>body._.name._.input,
    ""
  );

  UpdateData(
    [actual_category_data, "display"],
    <jsonHtml<HTMLInputElement>>body._.display._.input,
    "{{NAME}}"
  );
  const updateDisplay = () => {
    body._.display._.preview.dom.innerHTML = (<HTMLInputElement>(
      body._.display._.input.dom
    )).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
  };
  body._.display._.input.events.add("input", updateDisplay);
  body._.name._.input.events.add("input", updateDisplay);
  updateDisplay();

  UpdateDataSelect(
    [actual_category_data, "min_rank"],
    <jsonHtml<HTMLSelectElement>>body._.rank._.select,
    rankSelect,
    0,
    (value: string) => UserRank[value]
  );

  SetOrderActions(actual_order);
  LoadProductsOnCategoryModal(actual_order);

  SetOrderCategories(actual_subcategories);
  LoadCategoriesOnCategoryModal(actual_subcategories);

  modalCategory_events._save = async (modal: Modal) => {
    modal.disableActions();
    modal.setHeader("New category [SAVING]");

    try {
      await AddCategory({
        uuid: "",
        name: actual_category_data.name,
        display: actual_category_data.display,
        description: updateMDE.value(),
        image: actual_category_data.image,
        min_rank: actual_category_data.min_rank,
        order: actual_category_data.order,
        subcategories: actual_category_data.subcategories,
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
  const actual_subcategories: string[] = actual_category_data.subcategories;

  const body = modalCategory.getBody();

  // Title of modal
  modalCategory.setHeader(data.name);
  const uuid_s = body._.uuid;
  uuid_s.dom.innerHTML = "UUID: " + data.uuid;
  uuid_s.classes.remove("hidden");
  modalCategory.getActions()._.Delete.classes.remove("hidden");

  updateMDE.value(data.description);

  UpdateData(
    [actual_category_data, "name"],
    <jsonHtml<HTMLInputElement>>body._.name._.input,
    actual_category_data.name
  );

  UpdateData(
    [actual_category_data, "display"],
    <jsonHtml<HTMLInputElement>>body._.display._.input,
    actual_category_data.display
  );
  const updateDisplay = () => {
    body._.display._.preview.dom.innerHTML = (<HTMLInputElement>(
      body._.display._.input.dom
    )).value.replace(/\{\{NAME\}\}/gs, actual_category_data.name);
  };
  body._.display._.input.events.add("input", updateDisplay);
  body._.name._.input.events.add("input", updateDisplay);
  updateDisplay();

  UpdateDataSelect(
    [actual_category_data, "min_rank"],
    <jsonHtml<HTMLSelectElement>>body._.rank._.select,
    rankSelect,
    actual_category_data.min_rank - 1,
    (value: string) => UserRank[value]
  );

  SetOrderActions(actual_order);
  LoadProductsOnCategoryModal(actual_order);

  SetOrderCategories(actual_subcategories);
  LoadCategoriesOnCategoryModal(actual_subcategories);

  /** @param {Modal} modal */
  modalCategory_events._save = async (modal) => {
    modal.disableActions();

    modal.setHeader(data.name + " [SAVING]");

    try {
      await UpdateItem({
        uuid: actual_category_data.uuid,
        name: actual_category_data.name,
        display: actual_category_data.display,
        description: actual_category_data.description,
        image: actual_category_data.image,
        min_rank: actual_category_data.min_rank,
        order: actual_category_data.order,
        subcategories: actual_category_data.subcategories,
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
  modalCategory_events._delete = async (modal) => {
    if (confirm("Are you sure?")) {
      if (await RemItem(data.uuid, prompt('Write: "DELETE"'))) {
        modal.close();
        refreshAction_fn();
      }
    }
  };

  modalCategory.open();
}

function AddEvent(ev: string, elm: HTMLElement, fn: (e?: Event) => void) {
  elm.addEventListener(ev, fn);
}

function* ArrayIndex<T extends any = any>(arr: T[]): Generator<[T, number]> {
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

async function UpdateItem(data: Category): Promise<Boolean> {
  PrePostItem(data);
  const res = await fetch("/api/shop/category", {
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

async function RemItem(uuid: string, confirmation: string) {
  const res = await fetch("/api/shop/category", {
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
  cacheProducts = await res.json();
  productsListSelector.setList(cacheProducts);
})();
