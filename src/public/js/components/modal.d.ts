import { _listener as event_listener } from "../common/events.js";
declare namespace _Modal {
    interface action {
        name: string;
        color?: string;
        className?: string;
        onClick: (modal: Modal) => void;
    }
    interface config {
        title?: string;
        body?: HTMLElement | string;
        events?: {
            onOpen?: (modal: Modal) => void;
            onClose?: (modal: Modal) => void;
        };
        actions: action[];
    }
    enum HeaderStyle {
        Solid = 0,
        Outline = 1
    }
    const HeaderStyleMap: string[];
}
export declare class Modal {
    static parent: HTMLDivElement;
    static HeaderStyle: typeof _Modal.HeaderStyle;
    private config;
    private _events;
    element: HTMLDivElement;
    private _header;
    private _body;
    private _actions;
    constructor(config: _Modal.config);
    open(): void;
    close(): void;
    on(ev: string, listener: event_listener): void;
    setHeader(title: string, style?: _Modal.HeaderStyle): void;
    setBody(body: HTMLElement | string): void;
    setConfig(config: _Modal.config): void;
}
export {};
