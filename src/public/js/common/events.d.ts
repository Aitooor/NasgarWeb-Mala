export interface _listener {
    (...args: any[]): void;
}
export interface __events {
    [event: string]: _listener[];
}
export declare class EventEmitter {
    private _events;
    private _eventNames;
    constructor(opts: string[]);
    emit(name: string, args: any[]): void;
    on(name: string, listener: _listener): void;
    addListener(name: string, listener: _listener): void;
    off(name: string, listener: _listener): void;
    removeListener(name: string, listener: _listener): void;
    removeAllListeners(): void;
    getListeners(name: string): _listener[];
}
