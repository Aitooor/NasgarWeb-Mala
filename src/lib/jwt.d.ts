import { Request, Response } from "express";
/**
 * Generate new token
 */
export declare function generate(json: object): string;
/**
 * Verify jwt token and decode it
 */
export declare function decode(token: string): Object;
/**
 * Clear and Set token to new `json`
 */
export declare function put(json: any, res: Response): string;
/**
 * Add or Set the props on `json`
 */
export declare function add(json: any, req: Request, res: Response): string;
export declare var set: typeof add;
/**
 * Verify token
 */
export declare function verify(req: Request): boolean;
/**
 * Get info of token
 */
export declare function get(req: Request): any | null;
