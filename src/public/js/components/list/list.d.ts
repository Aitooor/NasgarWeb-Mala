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
    private parent;
    private url;
    private data;
    private cache;
    private _options;
    private template;
    isLoading: boolean;
    private _events;
    static Events: typeof Events;
    Events: typeof Events;
    private _onclickEvent;
    constructor(parent: HTMLDivElement, url: string, options?: ElementList_Options);
    setTemplate(template: string | K): this;
    getTemplate(): K;
    getData(): T[];
    getCache(): ElementList_Cache<T>;
    on(name: Events_type, listener: Listener<this, T, K>): this;
    setOnClick(listener: ClickEvent<this, T, K>): this;
    private _renderElement;
    private _render;
    refresh(): Promise<T[]>;
    refreshData(): Promise<T[] | null>;
}
export default ElementList;
