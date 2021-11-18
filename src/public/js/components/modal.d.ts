import { jsonHtml } from "../common/html.js";
import { _listener as event_listener } from "../common/events.js";
export declare namespace _Modal {
    interface Action {
        name: string;
        color?: ActionColor;
        className?: string;
        onClick: (modal: Modal) => void;
    }
    interface Config {
        title?: string;
        headerStyle?: HeaderStyle;
        body?: HTMLDivElement | string;
        cloneBody?: boolean;
        events?: {
            onOpen?: (modal: Modal) => void;
            onClose?: (modal: Modal) => void;
        };
        actions?: Action[];
    }
    enum HeaderStyle {
        Solid = 0,
        Outline = 1
    }
    enum ActionColor {
        Primary = 0,
        Secondary = 1,
        Info = 2,
        Danger = 3,
        Warning = 4
    }
}
export default class Modal {
    static parent: HTMLDivElement;
    static HeaderStyle: typeof _Modal.HeaderStyle;
    static ActionColor: typeof _Modal.ActionColor;
    static allModals: Modal[];
    private config;
    private _events;
    element: HTMLDivElement;
    private _header;
    private _body;
    private _body_json;
    private _actions;
    private _actions_json;
    constructor(config: _Modal.Config);
    get isOpen(): boolean;
    set isOpen(value: boolean);
    open(): void;
    close(): void;
    drainEvents(): void;
    disableAction(id: string | number): void;
    disableActions(): void;
    undisableAction(id: string | number): void;
    undisableActions(): void;
    on(ev: string, listener: event_listener): void;
    off(ev: string, listener: event_listener): void;
    addAction(action: _Modal.Action): void;
    getActions(): jsonHtml;
    getActionsConfig(): _Modal.Action[];
    getBodyDom(): HTMLDivElement;
    getBody(): jsonHtml<HTMLDivElement>;
    getHeader(): {
        dom: HTMLDivElement;
        title: string;
        style: _Modal.HeaderStyle;
    };
    setHeader(title?: string, style?: _Modal.HeaderStyle): void;
    setBody(body: HTMLDivElement | string): void;
    setActions(actions: _Modal.Action[]): void;
    setConfig(config: _Modal.Config): void;
}
