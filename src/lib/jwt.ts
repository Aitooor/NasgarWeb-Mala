import * as jwt from "jsonwebtoken"
import { Request, Response } from "express"
import * as CONFIG from "../../config"

/**
 * Generate new token
 */
export function generate(json: object): string {
	return jwt.sign(json, CONFIG.JWT)
}

/**
 * Verify jwt token and decode it
 */
export function decode(token: string): Object {
	try {
		return jwt.verify(token, CONFIG.JWT, { 
			complete: false 
		});
	} catch {
		return null;
	}
}

/**
 * Clear and Set token to new `json`
 */
export function put(json: any, res: Response): string{
	const str = generate(json);

	res.cookie("nasgar", str, { maxAge: 9999999, httpOnly: true })

	return str;
}

/**
 * Add or Set the props on `json`
 */
export function add(json: any, req: Request, res: Response): string{
	const g = get(req);

	if(g === null) {
		return put(json, res);
	} else {
		return put({
			...g,
			...json
		}, res);
	}
}

export var set: typeof add = add

/**
 * Verify token
 */
export function verify(req: Request): boolean {
	if(typeof req.cookies.nasgar === "string")
		try {
			jwt.verify(req.cookies.nasgar, CONFIG.JWT);
			return true;
		} catch {
			return false;
		}
		
	return false;
}

/**
 * Get info of token
 */
export function get(req: Request): any | null {
	if(!verify(req)) return null;

	return jwt.decode(req.cookies.nasgar, {
		json: true,
		complete: false
	})
}
