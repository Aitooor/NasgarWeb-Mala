import * as express from "express"

declare function middleware(
	req: express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>, 
	res: express.Response<any, Record<string, any>, number>,
	next: express.NextFunction): void;

var _exports = {
	middleware
};

export = _exports;