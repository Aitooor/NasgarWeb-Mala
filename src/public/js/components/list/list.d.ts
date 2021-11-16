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
declare type ClickEvent<G, T, K> = (_this: G, element: K, data: T) => void;
declare type CustomFunctions = {
    [key: string]: Function;
};
declare type PipeFunction = (method: string, ...args: any[]) => void;
export declare class ElementList<T extends any, K extends HTMLElement = HTMLDivElement> {
    protected parent: HTMLDivElement;
    protected url: string;
    protected data: T[];
    protected cache: ElementList_Cache<T>;
    protected _options: ElementList_Options;
    protected template: K;
    isLoading: boolean;
    protected _customFunctions: CustomFunctions;
    static Events: typeof Events;
    Events: typeof Events;
    protected _pipes: PipeFunction[];
    protected _onclickEvent: ClickEvent<this, T, K>;
    constructor(parent: HTMLDivElement, url: string, options?: ElementList_Options);
    setTemplate(template: string | K): this;
    getTemplate(): K;
    getData(): T[];
    getCache(): ElementList_Cache<T>;
    setCustomFunctions(fn: CustomFunctions): this;
    on(name: Events_type, listener: Listener<this, T, K>): this;
    setOnClick(listener: ClickEvent<this, T, K>): this;
    protected _generateCtx(data: T, elm: HTMLElement, template: HTMLElement): any;
    protected _setEventsOnElement(elm: HTMLElement, data: T): HTMLElement;
    protected _renderElement(data: T): K;
    protected _render(): K[];
    refresh(): Promise<T[]>;
    protected refreshData(): Promise<T[] | null>;
    protected _execPipes: PipeFunction;
    protected __usePipe(method: string, ...args: any[]): void;
    clearPipes(): void;
    pipe(fn: PipeFunction): this;
}
export default ElementList;
