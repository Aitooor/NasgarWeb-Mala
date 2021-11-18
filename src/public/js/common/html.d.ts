export declare function query<T extends HTMLElement = HTMLElement>(str: string, parent?: Document | HTMLElement): T;
export declare function queryAll<T extends HTMLElement = HTMLElement>(str: string, parent?: Document | HTMLElement): T[];
export declare function createElement<T extends HTMLElement = HTMLElement>(tag: string): T;
export interface middlewareEvents_return {
    removeAll(): void;
    add(...args: any[]): void;
    rem(...args: any[]): void;
    eventNames: string[];
    events: {
        [event: string]: Function[];
    };
}
export declare function middlewareEvents(element: HTMLElement): middlewareEvents_return;
export interface htmlElementStruct {
    elm?: string;
    classes?: string[];
    attrs?: {
        [attribute: string]: string;
    };
    childs?: (htmlElementStruct | string)[];
}
export interface jsonHtml<T extends HTMLElement = HTMLElement> {
    readonly dom: T;
    readonly elm: string;
    readonly classes: DOMTokenList;
    readonly attrs: {
        [attribute: string]: string;
    };
    readonly events: middlewareEvents_return;
    readonly hasChilds: boolean;
    readonly childs: jsonHtml<HTMLElement>[];
    readonly _: {
        [element: string]: jsonHtml<HTMLElement>;
    };
    addChild<T extends HTMLElement = HTMLElement>(child: T): jsonHtml<T>;
    setAttr(name: string, value?: string): jsonHtml<T>;
    remAttr(name: string): jsonHtml<T>;
}
export declare function structureCopy<T extends HTMLElement>(element: T): jsonHtml<T>;
export declare function getElementFromString<T extends HTMLElement = HTMLElement>(str: string): T;
export declare function getElementFromJSON<T extends HTMLElement = HTMLElement>(json: htmlElementStruct): jsonHtml<T>;
