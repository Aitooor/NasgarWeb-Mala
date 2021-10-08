interface middlewareEvents_return {
    removeAll(): void;
    add(...args: any[]): void;
    rem(...args: any[]): void;
    eventNames: string[];
    events: {
        [event: string]: Function[];
    };
}
export declare function middlewareEvents(element: HTMLElement): middlewareEvents_return;
export interface json_html<T extends HTMLElement = HTMLElement> {
    readonly dom: T;
    readonly elm: string;
    readonly classes: DOMTokenList;
    readonly attrs: {
        [attribute: string]: string;
    };
    readonly events: middlewareEvents_return;
    readonly hasChilds: boolean;
    readonly childs: json_html<HTMLElement>[];
    readonly _: {
        [element: string]: json_html<HTMLElement>;
    };
    addChild<T extends HTMLElement = HTMLElement>(child: T): json_html<T>;
}
export declare function structureCopy<T extends HTMLElement>(element: T): json_html<T>;
export {};