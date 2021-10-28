import * as express from "express"

declare function middleware(
	req: express.Request<{ [k: string]: string }, any, any, qs.ParsedQs, Record<string, any>>, 
	res: express.Response<any, Record<string, any>>,
	next: express.NextFunction): void;

declare function _exports(): {
	middleware: typeof middleware
}

export = _exports;