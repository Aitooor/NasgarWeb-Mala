import { _listener as EventListener } from "../../common/events.js";
export interface ElementList_Options {
    idTarget?: string;
}
export interface ElementList_Cache<T extends any> {
    [id: string]: T;
}
declare enum Events {
    Refresh = "refresh",
    Render = "render"
}
declare type Events_type = "refresh" | "render";
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
    constructor(parent: HTMLDivElement, url: string, options?: ElementList_Options);
    setTemplate(template: string | K): this;
    getTemplate(): K;
    getData(): T[];
    getCache(): ElementList_Cache<T>;
    on(name: Events_type, listener: EventListener): this;
    private _renderElement;
    private _render;
    refresh(): Promise<T[]>;
    refreshData(): Promise<T[] | null>;
}
export default ElementList;
