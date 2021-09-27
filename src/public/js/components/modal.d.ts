import { json_html } from "../common/html.js";
import { _listener as event_listener } from "../common/events.js";
export declare namespace _Modal {
    interface Action {
        name: string;
        color?: ActionColor;
        className?: string;
        onClick: (modal: Modal) => void;
    }
    interface Config {
        /**
         * Title of modal.
         * default: "Modal"
         */
        title?: string;
        /**
         * Header style.
         * default: Solid
         */
        headerStyle?: HeaderStyle;
        /**
         * Body of modal.
         * default: ""
         */
        body?: HTMLDivElement | string;
        /**
         * Clone body.
         * default: true
         */
        cloneBody?: boolean;
        events?: {
            onOpen?: (modal: Modal) => void;
            onClose?: (modal: Modal) => void;
        };
        /**
         * Action buttons of modal.
         * default: close button
         */
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
    private config;
    private _events;
    element: HTMLDivElement;
    private _header;
    private _body;
    private _body_json;
    private _actions;
    constructor(config: _Modal.Config);
    open(): void;
    close(): void;
    /**
     * Just use when `config.cloneBody` is `true`.
     */
    drainEvents(): void;
    on(ev: string, listener: event_listener): void;
    off(ev: string, listener: event_listener): void;
    addAction(action: _Modal.Action): void;
    getActions(): _Modal.Action[];
    getBodyDom(): HTMLDivElement;
    getBody(): json_html<HTMLDivElement>;
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
