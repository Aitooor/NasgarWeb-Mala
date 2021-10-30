import { _listener as EventListener } from "../../common/events.js";
export interface ElementList_Options {
    idTarget?: string;
}
export interface ElementList_Cache<T extends any> {
    [id: string]: T;
}
export declare class ElementList<T extends any, K extends HTMLElement = HTMLDivElement> {
    private parent;
    private url;
    private data;
    private cache;
    private options;
    private template;
    private _isLoading;
    private _events;
    constructor(parent: HTMLDivElement, url: string, options?: ElementList_Options);
    setTemplate(template: string | K): this;
    getTemplate(): K;
    getData(): T[];
    getCache(): ElementList_Cache<T>;
    on(name: string, listener: EventListener): this;
    private _renderElement;
    private _render;
    refresh(): Promise<T[]>;
    refreshData(): Promise<T[] | null>;
}
export default ElementList;
