import Fuse from "../../../vendor/fusejs/fuse.js";
import { getCache, setCache } from "../../common/cache.js";
import {
  getElementFromJSON,
  getElementFromString,
  jsonHtml,
  structureCopy,
} from "../../common/html.js";

const templateHtml = `
<div class="selector-list">
  <div class="selector-list__header" data-name="header">
    <input type="text"/>
    <button><i class="material">search</i></button>
  </div>
  <div class="selector-list__body">
    <div class="selector-list__hint">
      Use
      <span class="text-style-code"><span class="code-active">#</span><span class="code-comment">ID</span></span>
      to ID's, <span class="text-style-code"><span class="code-comment">NAME</span></span> to name, and
      <span class="text-style-code"><span class="code-active">@</span><span class="code-comment">CATEGORY</span></span>
      to categories.
    </div>
    <div class="selector-list__selectors"></div>
    <div class="selector-list__list" data-name="list"></div>
  </div>
</div>`;

let parent: HTMLElement = getCache("selector-list-parent", null);

if (!parent) {
  parent = document.createElement("div");
  parent.className = "selector-list-parent";
  document.body.appendChild(parent);

  setCache("selector-list-parent", parent);
}

export interface RecomendedSelectorListOptionsProperties {
  style: "small" | "medium" | "large";
  target: string;
  text: string;
}

export interface RecomendedSelectorListOptions<T = any> {
  list: T[];
  properties: (string | RecomendedSelectorListOptionsProperties)[];
  hint?: string;
  target: HTMLElement;
  useOnInput?: boolean;
  onSelect?(item: T): void;
  onClose?(): void;
}

const defaultOptions: RecomendedSelectorListOptions<any> = {
  list: [],
  properties: [],
  hint: "",
  target: document.querySelector("body"),
  useOnInput: false,
  onSelect: () => {},
  onClose: () => {},
};

export class RecomendedSelectorList<T = any> {
  element: HTMLDivElement;
  protected structure: jsonHtml;
  private options: RecomendedSelectorListOptions<T>;
  private fuse: Fuse<T>;

  constructor(options?: RecomendedSelectorListOptions<T>) {
    this.options = { ...defaultOptions, ...(options || {}) };
    this.fuse = new Fuse<T>(this.options.list, {
      keys: options.properties.map((property) => {
        if (typeof property === "string") {
          return property;
        }

        return property.target;
      }),
      isCaseSensitive: false,
      includeScore: false
    });
    this.element = getElementFromString<HTMLDivElement>(templateHtml);
    this.structure = structureCopy<HTMLDivElement>(this.element);
    this.structure.classes.remove("active");

    if (this.options.hint) {
      this.structure.childs[1].childs[0].dom.innerHTML = this.options.hint;
    }

    if (this.options.useOnInput) {
      this.options.target.addEventListener("click", () => {
        this.open();
      });

      this.options.target.addEventListener("blur", () => {
        this.close();
      });
    }

    this.options.target.addEventListener("input", () => {
      this.search((<HTMLInputElement>this.options.target).value);
    });

    parent.appendChild(this.element);
    this._reloadSelectors();
    this.refresh();
  }

  protected _createSelector(
    property: string | RecomendedSelectorListOptionsProperties
  ) {
    const selector = getElementFromJSON({
      elm: "div",
      classes: [
        "selector-list__selector",
        typeof property === "string" ? "medium" : property.style,
      ],
      childs: typeof property === "string" ? [property] : [property.text],
    });

    return selector;
  }

  protected _reloadSelectors() {
    const selectors = this.structure.childs[1].childs[1];
    selectors.dom.innerHTML = "";
    selectors.childs.splice(0, selectors.childs.length);
    this.options.properties.map((property) => {
      const selector = this._createSelector(property);
      selectors.addChild(selector.dom);
      return selector;
    });
  }

  protected _createListItem(item: T) {
    const listItem = getElementFromJSON({
      elm: "div",
      classes: ["selector-list-item"],
      childs: this.options.properties.map((property) => {
        if (typeof property === "string")
          return {
            elm: "div",
            classes: ["selector-list-item__column", "medium"],
            childs: [item[property]],
          };

        const { style, target } = property;
        return {
          elm: "div",
          classes: ["selector-list-item__column", style],
          childs: [item[target]],
        };
      }),
    });

    listItem.events.add("click", () => {
      this.options.onSelect(item);
      this.close();
    });

    return listItem;
  }

  refresh() {
    const listElm = this.structure.childs[1]._["list"];
    listElm.dom.innerHTML = "";
    listElm.childs.splice(0, listElm.childs.length);
    this.options.list.map<jsonHtml<HTMLElement>>((item: T) => {
      const listItem = this._createListItem(item);
      listElm.addChild(listItem.dom);
      return listItem;
    });
  }

  open() {
    this.structure.classes.add("active");
    this.element.style.top = `${
      this.options.target.offsetTop + this.options.target.clientHeight
    }px`;
    this.element.style.left = `${this.options.target.offsetLeft}px`;
  }

  close() {
    this.structure.classes.remove("active");
    this.options.onClose();
  }

  search(query: string) {
    const results: Fuse.FuseResult<T>[] = this.fuse.search(query);
    console.log(results);
    
    this.refresh();
  }
}
