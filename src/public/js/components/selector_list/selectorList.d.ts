import { jsonHtml } from "../../common/html.js";
export interface RecomendedSelectorListOptionsProperties {
    style: "small" | "medium" | "large";
    target: string;
    text: string;
}
export interface RecomendedSelectorListOptions<T = any> {
    list: T[];
    properties: (string | RecomendedSelectorListOptionsProperties)[];
    hint?: string;
    target: HTMLElement;
    useOnInput?: boolean;
    onSelect?(item: T): void;
    onClose?(): void;
}
export declare class RecomendedSelectorList<T = any> {
    element: HTMLDivElement;
    protected structure: jsonHtml;
    private options;
    private fuse;
    constructor(options?: RecomendedSelectorListOptions<T>);
    protected _createSelector(property: string | RecomendedSelectorListOptionsProperties): jsonHtml<HTMLElement>;
    protected _reloadSelectors(): void;
    protected _createListItem(item: T): jsonHtml<HTMLElement>;
    refresh(): void;
    open(): void;
    close(): void;
    search(query: string): void;
}
