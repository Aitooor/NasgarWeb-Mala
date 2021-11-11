import {
  EventEmitter,
  _listener as EventListener,
} from "../../common/events.js";
import { queryAll } from "../../common/html.js";

export interface ElementList_Options {
  idTarget?: string;
}

const DefaultElementList_Options: ElementList_Options = {
  idTarget: "uuid",
};

export interface ElementList_Cache<T extends any> {
  [id: string]: T;
}

enum Events {
  Refresh = "refresh",
  Render = "render",
  TemplateClick = "template_click",
}

type Events_type = "refresh" | "render" | "template_click";

type Listener<G, T, K> =
  | ((_this: G) => void)
  | ((_this: G, r: boolean) => void)
  | ((_this: G, element: K, data: T) => void);

type ClickEvent<G, T, K> = ((_this: G, element: K, data: T) => void);

export class ElementList<
  T extends any,
  K extends HTMLElement = HTMLDivElement
> {
  private data: T[] = [];
  private cache: ElementList_Cache<T> = {};

  private _options: ElementList_Options;

  private template: K = null;

  public isLoading: boolean = false;

  private _events: EventEmitter<
    [ElementList<T, K>, boolean | K, T | undefined]
  > = new EventEmitter<[ElementList<T, K>, boolean | K, T | undefined]>([
    Events.Refresh,
    Events.Render,
    Events.TemplateClick,
  ]);

  static Events: typeof Events = Events;
  public Events: typeof Events = Events;

  private _onclickEvent: ClickEvent<this, T, K> = null;

  constructor(
    private parent: HTMLDivElement,
    private url: string,
    options: ElementList_Options = DefaultElementList_Options
  ) {
    this._options = Object.assign({}, DefaultElementList_Options, options);
    Object.values(Events);
  }

  setTemplate(template: string | K): this {
    if (typeof template === "string") {
      const temp = document.createElement("div");
      temp.innerHTML = template;
      this.template = <K>temp.firstChild;
    } else {
      this.template = <K>template.cloneNode(true);
    }

    return this;
  }

  getTemplate(): K {
    return this.template;
  }

  getData(): T[] {
    return this.data.slice(0);
  }
  getCache(): ElementList_Cache<T> {
    return Object.assign({}, this.cache);
  }

  /*******************************/
  /***         Methods         ***/
  /*******************************/

  on(name: Events_type, listener: Listener<this, T, K>): this {
    this._events.on(name, <EventListener<[]>>listener);
    return this;
  }

  setOnClick(listener: ClickEvent<this, T, K>): this {
    this._onclickEvent = listener;
    return this;
  }

  private _renderElement(data: T): K {
    if (this.template === null) {
      throw new ReferenceError("`template` is not defined.");
    }

    const elm: K = <K>this.template.cloneNode(true);
    const allElementsWithSlot: HTMLElement[] = queryAll("*[slot]", elm);

    for (const elmWithSlot of allElementsWithSlot) {
      const slot = elmWithSlot.getAttribute("slot");

      elmWithSlot.innerHTML = getFromProperty<T, string>(data, slot);
    }

    const _events = this._events;

    elm.addEventListener("click", () => {
      this._onclickEvent(this, elm, data);
    });

    return elm;
  }

  private _render(): K[] {
    if (this.template === null) {
      throw new ReferenceError("`template` is not defined.");
    }

    const elms: K[] = [];

    for (const oneData of this.data) {
      elms.push(this._renderElement(oneData));
    }

    return elms;
  }

  async refresh(): Promise<T[]> {
    if (this.isLoading) return this.data;
    this.isLoading = true;
    this._events.emit(Events.Refresh, [this, true, null]);

    this.parent.classList.remove("no-data");
    this.parent.classList.add("loading");
    this.parent.innerHTML = "Loading...";

    await this.refreshData();

    const elements: K[] = this._render();

    if (elements.length === 0) {
      this.parent.innerHTML = "No data";
      this.parent.classList.add("no-data");
    } else {
      this.parent.innerHTML = "";
      this.parent.append(...elements);
    }

    this.parent.classList.remove("loading");

    this._events.emit(Events.Refresh, [this, false, null]);
    this.isLoading = false;

    return this.data;
  }

  async refreshData(): Promise<T[] | null> {
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      alert(`Error fetching data to '${this.url}'.`);
      return null;
    }

    const json = await response.json();

    this.data = json;
    this.cache = this.data.reduce((prev, acc) => {
      prev[acc[this._options.idTarget]] = acc;
      return prev;
    }, {});

    return this.data;
  }
}
export default ElementList;

function getFromProperty<T extends Object = Object, K extends any = any>(
  obj: T,
  propStr: string
): K {
  const props = propStr.split(".");
  let last: any = obj;

  for (const prop of props) {
    if (typeof last === "undefined")
      throw new ReferenceError(`Property doesn't exists.`);
    last = last[prop];
  }

  return <K>last;
}
