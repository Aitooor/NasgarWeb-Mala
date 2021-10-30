import { EventEmitter, _listener as EventListener } from "../../common/events.js"
import { queryAll } from "../../common/html.js";

export interface ElementList_Options {
  idTarget?: string,
}

const DefaultElementList_Options: ElementList_Options = {
  idTarget: "uuid"
}

export interface ElementList_Cache<T extends any> {
  [id: string]: T
}

export class ElementList<T extends any, K extends HTMLElement = HTMLDivElement> {
  private data: T[] = [];
  private cache: ElementList_Cache<T> = {};

  private options: ElementList_Options;

  private template: K = null;

  private _isLoading: boolean = false;

  private _events: EventEmitter = new EventEmitter(["refresh", "refresh", "render"]);


  constructor(private parent: HTMLDivElement, private url: string, options: ElementList_Options = DefaultElementList_Options) {
    this.options = Object.assign({}, DefaultElementList_Options, options);
  }

  
  
  setTemplate(template: string | K): this {
    if(typeof template === "string") {
      const temp = document.createElement("div");
      temp.innerHTML = template;
      this.template = <K> temp.firstChild;
    } else {
      this.template = <K> template.cloneNode(true);
    }

    return this;
  }

  getTemplate(): K { return this.template; }

  getData(): T[] { return this.data.slice(0); }
  getCache(): ElementList_Cache<T> { return Object.assign({}, this.cache) }


  /*******************************/
  /***         Methods         ***/
  /*******************************/


  on(name: string, listener: EventListener): this {
    this._events.on(name, listener);
    return this;
  }

  private _renderElement(data: T): K {
    if(this.template === null) {
      throw new ReferenceError("`template` is not defined.");
    }

    const elm: K = <K>this.template.cloneNode();
    const allElementsWithSlot: HTMLElement[] = queryAll("*[slot]", elm);

    for (const elmWithSlot of allElementsWithSlot) {
      const slot = elmWithSlot.getAttribute("slot");

      elm.innerHTML = getFromProperty<T, string>(data, slot);
    }

    return elm;
  }

  private _render(): K[] {
    if(this.template === null) {
      throw new ReferenceError("`template` is not defined.");
    }

    const elms: K[] = [];

    for(const oneData of this.data) {
      elms.push(this._renderElement(oneData));
    }

    return elms;
  }

  async refresh(): Promise<T[]> {
    if(this._isLoading) return;
    this._isLoading = true;
    this._events.emit("refresh", [this, true]);

    this.parent.classList.add("loading");
    this.parent.innerHTML = "Loading...";

    await this.refreshData();

    const elements: K[] = this._render();

    this.parent.append(...elements);
    this.parent.classList.remove("loading");

    this._events.emit("refresh", [this, false]);
    this._isLoading = false;
  }

  async refreshData(): Promise<T[] | null> {
    const response = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-cache"
    });

    if(!response.ok) {
      alert(`Error fetching data to '${this.url}'.`);
      return null;
    }

    const json = await response.json();

    this.data = json;
    this.cache = this.data.reduce((prev, acc) => {
      prev[acc[this.options.idTarget]] = acc;
      return prev;
    }, {});

    console.log(this.data, this.cache);

    return this.data;
  }
} 
export default ElementList;


function getFromProperty<T extends Object = Object, K extends any = any>(obj: T, propStr: string): K {
  const props = propStr.split(".");
  let last: any = obj;

  for(const prop of props) {
    if(typeof last === "undefined") 
      throw new ReferenceError(`Property doesn't exists.`);
    last = last[prop];
  }

  return <K>last;
}