import ElementList, { ElementList_Options } from "./list";
export interface OrdenedElementList_Options extends ElementList_Options {
    autoRefresh: boolean;
}
export declare class OrdenedElementList<T extends any = any, K extends HTMLElement = HTMLDivElement> extends ElementList<T, K> {
    static NO_URL: string;
    protected _options: OrdenedElementList_Options;
    constructor(parent: HTMLDivElement, url?: string, options?: OrdenedElementList_Options);
    private __refresh;
    private _getIndex;
    goUp(elm: T): T[];
    goUp(elm: number): T[];
    goDown(elm: T | number): T[];
    delete(elm: T | number): T[];
}
