import * as cache from "../common/cache.js";
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

namespace _Modal {
  export interface action {
    name: string;
    color?: string;
    className?: string;
    onClick: (modal: Modal) => void;
  }

  export interface config {
    title?: string;
    body?: HTMLElement | string;
    events?: {
      onOpen?: (modal: Modal) => void;
      onClose?: (modal: Modal) => void;
    };
    actions: action[]
  }

  export enum HeaderStyle {
    Solid, Outline
  }

  export const HeaderStyleMap = Object.keys(HeaderStyle).map(_ => _.toLowerCase());
}

export class Modal {
  public static parent: HTMLDivElement = parent;
  public static HeaderStyle = _Modal.HeaderStyle;

  private config: _Modal.config = {
    title: "",
    body: "",
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

  element: HTMLDivElement = null;

  private _header: HTMLDivElement;
  private _body: HTMLDivElement;
  private _actions: HTMLDivElement;
  
  constructor(config: _Modal.config) {
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
    this._events.emit("open", [this]);
  }

  close() {
    this._events.emit("close", [this]);
  }

  on(ev: string, listener: event_listener) {
    this._events.on(ev, listener);
  }

  setHeader(title: string, style?: _Modal.HeaderStyle) {
    this._header.innerHTML = title;
    if(style) {
      this._header.className = "modal-header " + _Modal.HeaderStyleMap[style];
    }
  }

  setBody(body: HTMLElement | string): void {
  }

  setConfig(config: _Modal.config): void {
    if(config.title)
      0;
    if(config.body)
      this.setBody(config.body);
    if(config.events) {
    }
  }
}

