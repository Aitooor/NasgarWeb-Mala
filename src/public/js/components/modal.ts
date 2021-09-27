import * as cache from "../common/cache.js";
import { structureCopy, json_html } from "../common/html.js";
import { EventEmitter, _listener as event_listener } from "../common/events.js";

const c_pre = "modal_";
const c_hasParent = c_pre + "hasParent";
const c_parent = c_pre + "parent"

const hasParent = cache.getCache<boolean>(c_hasParent, false);

const parent = cache.getCache<HTMLDivElement>(c_parent, document.createElement("div"));

if(!hasParent) {
  document.body.append(parent);
  cache.setCache<boolean>(c_hasParent, true);
  cache.setCache<HTMLDivElement>(c_parent, parent);
}

export namespace _Modal {
  export interface Action {
    name: string;
    color?: ActionColor;
    className?: string;
    onClick: (modal: Modal) => void;
  }

  export interface Config {
    /**
     * Title of modal.
     * default: "Modal"
     */
    title?: string;
    /**
     * Header style.
     * default: Solid
     */
    headerStyle?: HeaderStyle;
    /**
     * Body of modal.
     * default: ""
     */
    body?: HTMLDivElement | string;
    /**
     * Clone body.
     * default: true
     */
    cloneBody?: boolean;
    events?: {
      onOpen?: (modal: Modal) => void;
      onClose?: (modal: Modal) => void;
    };
    /**
     * Action buttons of modal.
     * default: close button
     */
    actions?: Action[];
  }

  export enum HeaderStyle {
    Solid, Outline
  }

  export enum ActionColor {
    Primary,
    Secondary,
    Info,
    Danger,
    Warning
  }
}

export default class Modal {
  public static parent: HTMLDivElement = parent;
  public static HeaderStyle = _Modal.HeaderStyle;
  public static ActionColor = _Modal.ActionColor;

  private config: _Modal.Config = {
    title: "",
    headerStyle: _Modal.HeaderStyle.Solid,
    body: "",
    cloneBody: true,
    events: {
      onOpen: () => {},
      onClose: () => {}
    },
    actions: [{
      name: "close",
      onClick: (modal: Modal) => {modal.close();}
    }]
  };

  private _events: EventEmitter = new EventEmitter(["open", "close"]);

  element: HTMLDivElement;

  private _header: HTMLDivElement;
  private _body: HTMLDivElement;
  private _body_json: json_html<HTMLDivElement> = null;
  private _actions: HTMLDivElement;
  
  constructor(config: _Modal.Config) {
    this.element  = document.createElement("div");
    this._header  = document.createElement("div");
    this._body    = document.createElement("div");
    this._actions = document.createElement("div");

    this.element.className  = "modal";
    this._header.className  = "modal-header";
    this._body.className    = "modal-body";
    this._actions.className = "modal-actions";

    this.element.append(this._header, this._body, this._actions);

    Modal.parent.append(this.element);

    this.setConfig(config);
  }
 
  open() {
    this.element.classList.add("active");
    this._events.emit("open", [this]);
  }

  close() {
    this.element.classList.remove("active")
    this._events.emit("close", [this]);
  }

  /**
   * Just use when `config.cloneBody` is `true`.
   */
  drainEvents() {
    if(!this.config.cloneBody) return;

    function deep(elm: json_html) {
      elm.events.removeAll();
      for(const child of elm.childs)
        deep(child);
    }

    deep(this._body_json);
  }


  /*-********* Events *********-*/

  on(ev: string, listener: event_listener) {
    this._events.on(ev, listener);
  }

  off(ev: string, listener: event_listener) {
    this._events.off(ev, listener);
  }


  /*-********* Add Modal parts *********-*/

  addAction(action: _Modal.Action) {
    this.config.actions.push(action);

    const btn = document.createElement("button");
    btn.innerHTML = action.name;
    btn.className = action.className ?? "";
    btn.classList.add(_Modal.ActionColor[action.color ?? 0].toLowerCase());
  }


  /*-********* Get Modal parts *********-*/

  getActions(): _Modal.Action[] {
    return this.config.actions.slice(0);
  }

  getBodyDom(): HTMLDivElement {
    return this._body;
  }

  getBody(): json_html<HTMLDivElement> {
    return this._body_json;
  }

  getHeader(): { dom: HTMLDivElement, title: string, style: _Modal.HeaderStyle } {
    return {
      dom: this._header,
      title: this.config.title,
      style: this.config.headerStyle
    };
  }


  /*-********* Set Modal parts *********-*/

  setHeader(title?: string, style?: _Modal.HeaderStyle) {
    if(title) 
      this._header.innerHTML = title;
    if(style)
      this._header.className = "modal-header " + _Modal.HeaderStyle[style].toLowerCase();
  }

  setBody(body: HTMLDivElement | string): void {
    if(typeof body === "string") {
    } else {
      if(this.config.cloneBody) {
        const clone = structureCopy<HTMLDivElement>(body);
        clone.classes.add("modal-body")
        this._body = clone.dom;
        this._body_json = clone;
      } else {
      }
    }
  }

  setActions(actions: _Modal.Action[]) {
    for(const action of actions)
      this.addAction(action);
  }

  setConfig(config: _Modal.Config): void {
    this.setHeader(
      config.title ?? this.config.title,
      config.headerStyle ?? this.config.headerStyle);

    this.config.cloneBody = config.cloneBody ?? this.config.cloneBody;

    this.setBody(<HTMLDivElement | string>config.body ?? this.config.body);

    if(config.events) {
      if(config.events.onOpen)
        this.on("open", config.events.onOpen);
      if(config.events.onClose)
        this.on("close", config.events.onClose);
    }
  }
}

