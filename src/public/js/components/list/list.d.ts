import { EventEmitter } from "../../common/events.js";
export interface ElementList_Options {
    idTarget?: string;
}
export interface ElementList_Cache<T extends any> {
    [id: string]: T;
}
declare enum Events {
    Refresh = "refresh",
    Render = "render",
    TemplateClick = "template_click"
}
declare type Events_type = "refresh" | "render" | "template_click";
declare type Listener<G, T, K> = ((_this: G) => void) | ((_this: G, r: boolean) => void) | ((_this: G, element: K, data: T) => void);
declare type ClickEvent<G, T, K> = ((_this: G, element: K, data: T) => void);
export declare class ElementList<T extends any, K extends HTMLElement = HTMLDivElement> {
    protected parent: HTMLDivElement;
    protected url: string;
    protected data: T[];
    protected cache: ElementList_Cache<T>;
    protected _options: ElementList_Options;
    protected template: K;
    isLoading: boolean;
    protected _events: EventEmitter<[
        ElementList<T, K>,
        boolean | K,
        T | undefined
    ]>;
    static Events: typeof Events;
    Events: typeof Events;
    protected _onclickEvent: ClickEvent<this, T, K>;
    constructor(parent: HTMLDivElement, url: string, options?: ElementList_Options);
    setTemplate(template: string | K): this;
    getTemplate(): K;
    getData(): T[];
    getCache(): ElementList_Cache<T>;
    on(name: Events_type, listener: Listener<this, T, K>): this;
    setOnClick(listener: ClickEvent<this, T, K>): this;
    protected _renderElement(data: T): K;
    protected _render(): K[];
    refresh(): Promise<T[]>;
    protected refreshData(): Promise<T[] | null>;
}
export default ElementList;
