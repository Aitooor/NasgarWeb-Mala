declare type LogArgument = string | number | boolean | Function | Symbol | Object;
/**
 * API
 * Format General
 */
export declare function log(...args: LogArgument[]): void;
/**
 * API
 * Format General
 */
export declare function warn(...args: LogArgument[]): void;
/**
 * API
 * Format Error
 */
export declare function error(error: Error): void;
/**
 * API
 * Format General
 */
export declare function error(...args: (LogArgument | Error)[]): void;
export {};
