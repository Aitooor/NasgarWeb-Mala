import Fuse from "../../../vendor/fusejs/fuse.js";
import { getCache, setCache } from "../../common/cache.js";
import {
  getAbsolutePosition,
  getElementFromJSON,
  getElementFromString,
  jsonHtml,
  structureCopy,
} from "../../common/html.js";

const templateHtml = `
<div class="selector-list">
  <div class="selector-list__header" data-name="header">
    <input type="text"/>
  </div>
  <div class="selector-list__body">
    <div class="selector-list__hint"></div>
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
  regex?: string | RegExp;
  visible?: boolean;
}

export interface RecomendedSelectorListOptions<T = any> {
  list: T[];
  properties: (string | RecomendedSelectorListOptionsProperties)[];
  hint?: string;
  target?: HTMLElement | HTMLElement[];
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
  protected structure: jsonHtml<HTMLDivElement>;
  protected inputCard: jsonHtml<HTMLInputElement>;
  private options: RecomendedSelectorListOptions<T>;

  private fuse: Fuse<T>;
  private fuseByProperty: { [key: string]: Fuse<T> } = {};

  private activeTarget: HTMLElement = null;

  isOpen: boolean = false;

  #RegExp(regex: string | RegExp): RegExp {
    if (typeof regex === "string") {
      return new RegExp(regex);
    }
    return regex;
  }

  constructor(options?: RecomendedSelectorListOptions<T>) {
    this.options = { ...defaultOptions, ...(options || {}) };
    this.#_init();
  }

  #_init() {
    // Create structure
    this.element = getElementFromString<HTMLDivElement>(templateHtml);
    this.structure = structureCopy<HTMLDivElement>(this.element);
    this.structure.classes.remove("active");
    this.inputCard = <jsonHtml<HTMLInputElement>>(
      this.structure.childs[0].childs[0]
    );

    // Create Fuse instances
    this.setList(this.options.list);

    if (this.options.hint) {
      this.structure.childs[1].childs[0].dom.innerHTML = this.options.hint;
    }

    // Set targets if are setted
    if (this.options.target) {
      this.setTarget(this.options.target);
    }

    // Add all event listeners to the elements
    this.inputCard.events.add("input", () => {
      this.search(this.inputCard.dom.value);
    });

    this.inputCard.events.add("blur", (e) => {
      this.close();
    });

    // Append to parent
    parent.appendChild(this.element);

    // Reload
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
    this.options.properties.forEach((property) => {
      if (typeof property !== "string" && !property.visible) {
        return;
      }
      const selector = this._createSelector(property);
      selectors.addChild(selector.dom);
      return selector;
    });
  }

  protected _createListItem(item: T) {
    const listItem = getElementFromJSON({
      elm: "div",
      classes: ["selector-list-item"],
      childs: this.options.properties
        .map((property) => {
          if (typeof property === "string")
            return {
              elm: "div",
              classes: ["selector-list-item__column", "medium"],
              childs: [item[property]],
            };

          const { style, target, visible } = property;
          if (visible === false) {
            return null;
          }
          return {
            elm: "div",
            classes: ["selector-list-item__column", style],
            childs: [item[target]],
          };
        })
        .filter((item) => item !== null),
    });

    listItem.events.add("click", () => {
      this.options.onSelect(item);
      this.close();
    });

    return listItem;
  }

  private _onScroll(e: MouseEvent) {
    const { x, y } = {
      x: e.pageX,
      y: e.pageY,
    }
    console.log(x, y);
    
    this.element.style.top = `${
      y
    }px`;
    this.element.style.left = `${x}px`;
  }

  setList(list: T[]) {
    this.options.list = list;
    this.fuse = new Fuse(this.options.list, {
      keys: this.options.properties.map((property) => {
        if (typeof property === "string") return property;
        return property.target;
      }),
      isCaseSensitive: false,
      includeScore: false,
      shouldSort: true,
      threshold: 0.3,
    });

    this.fuseByProperty = {};
    this.options.properties.forEach((property) => {
      if (typeof property === "string") return;

      this.fuseByProperty[property.target] = new Fuse(this.options.list, {
        keys: [property.target],
        isCaseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.3,
      });
    });
    this.refresh();
  }

  setTarget(_target: HTMLElement | HTMLElement[]) {
    let targets: HTMLElement[] = Array.isArray(_target) ? _target : [_target];
    for (const target of targets) {
      if (this.options.useOnInput) {
        if (target.tagName !== "INPUT") {
          throw new Error("Target must be an input element");
        }
        target.addEventListener("click", (e: MouseEvent) => {
          this.open(target, e);
          this._onScroll(e);
          this.search((<HTMLInputElement>target).value);
        });

        target.addEventListener("blur", () => {
          this.close();
        });
      }

      target.addEventListener("input", () => {
        this.search((<HTMLInputElement>target).value);
      });
    }

    this.options.target = targets;
  }

  /**
   * Refresh the list
   */
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

  /**
   * Show component
   */
  open(target?: HTMLElement, event?: MouseEvent) {
    if(this.isOpen) return;
    this.isOpen = true;
    this.inputCard.dom.value = "";

    if (
      target &&
      (Array.isArray(this.options.target)
        ? this.options.target.includes(target)
        : this.options.target === target)
    ) {
      this.activeTarget = target;
    } else if (Array.isArray(this.options.target)) {
      this.activeTarget = this.options.target[0];
    } else {
      this.activeTarget = this.options.target;
    }

    this.structure.classes.add("active");
    this._onScroll(event);
    // window.addEventListener("scroll", this.__onScroll);
  }

  /**
   * Hide component
   */
  close() {
    this.isOpen = false;
    this.structure.classes.remove("active");
    this.options.onClose();

    // window.removeEventListener("scroll", this.__onScroll);
  }

  /**
   * Search for a string in the list and render the results
   * @param query String of query
   */
  search(query: string) {
    this.inputCard.dom.value = query;

    if (query.length === 0) {
      this.refresh();
      return;
    }

    // Select Fuse engine by property and use it to search
    let results: Fuse.FuseResult<T>[] = null;
    this.options.properties.forEach((property) => {
      if (typeof property === "string") return;
      if (property.regex && this.#RegExp(property.regex).test(query)) {
        results = this.fuseByProperty[property.target].search(query);
      }
    });

    if (!results) {
      results = this.fuse.search(query);
    }

    // Refresh list with results
    const listElm = this.structure.childs[1]._["list"];
    listElm.dom.innerHTML = "";
    listElm.childs.splice(0, listElm.childs.length);
    results.forEach((result: Fuse.FuseResult<T>) => {
      const listItem = this._createListItem(result.item);
      listElm.addChild(listItem.dom);
    });
  }
}
