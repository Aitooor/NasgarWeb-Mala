import { jsonHtml } from "../../common/html.js";
export interface RecomendedSelectorListOptionsProperties {
    style: "small" | "medium" | "large";
    target: string;
    text: string;
    regex?: string | RegExp;
    visible?: boolean;
}
export interface RecomendedSelectorListOptions<T = any> {
    list: T[];
    properties: (string | RecomendedSelectorListOptionsProperties)[];
    hint?: string;
    target?: HTMLElement | HTMLElement[];
    useOnInput?: boolean;
    onSelect?(item: T): void;
    onClose?(): void;
}
export declare class RecomendedSelectorList<T = any> {
    #private;
    element: HTMLDivElement;
    protected structure: jsonHtml<HTMLDivElement>;
    protected inputCard: jsonHtml<HTMLInputElement>;
    private options;
    private fuse;
    private fuseByProperty;
    private activeTarget;
    isOpen: boolean;
    constructor(options?: RecomendedSelectorListOptions<T>);
    protected _createSelector(property: string | RecomendedSelectorListOptionsProperties): jsonHtml<HTMLElement>;
    protected _reloadSelectors(): void;
    protected _createListItem(item: T): jsonHtml<HTMLElement>;
    private _onScroll;
    setList(list: T[]): void;
    setTarget(_target: HTMLElement | HTMLElement[]): void;
    refresh(): void;
    open(target?: HTMLElement, event?: MouseEvent): void;
    close(): void;
    search(query: string): void;
}
