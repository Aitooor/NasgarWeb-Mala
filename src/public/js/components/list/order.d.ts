import ElementList, { ElementList_Options } from "./list.js";
export interface OrdenedElementList_Options extends ElementList_Options {
    autoRefresh: boolean;
}
export declare class OrdenedElementList<T extends any = any, K extends HTMLElement = HTMLDivElement> extends ElementList<T, K> {
    static NO_URL: string;
    protected _options: OrdenedElementList_Options;
    constructor(parent: HTMLDivElement, url?: string, options?: OrdenedElementList_Options);
    protected _generateCtx(data: T, elm: HTMLElement, template: HTMLElement): Object;
    private __refresh;
    getIndex(elm: T | number): number;
    goUp(elm: T): T[];
    goUp(elm: number): T[];
    goDown(elm: T): T[];
    goDown(elm: number): T[];
    add(elm: T): T[];
    delete(elm: T | number): T[];
    deleteAll(): T[];
    private _returnDataAndRefresh;
}
