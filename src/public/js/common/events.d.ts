export declare type _listener<T extends any[] = Array<any>> = (...args: T) => void;
export interface __events<T extends any[] = Array<any>> {
    [event: string]: _listener<T>[];
}
export declare class EventEmitter<T extends any[] = Array<any>> {
    private _events;
    private _eventNames;
    constructor(opts: string[]);
    emit(name: string, args: T): void;
    on(name: string, listener: _listener<T>): void;
    addListener(name: string, listener: _listener<T>): void;
    off(name: string, listener: _listener<T>): void;
    removeListener(name: string, listener: _listener<T>): void;
    removeAllListeners(): void;
    getListeners(name: string): _listener<T>[];
}
