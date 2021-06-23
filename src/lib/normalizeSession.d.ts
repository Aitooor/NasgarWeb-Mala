import * as express from "express";

declare function normalizeSession(
	req: express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>, 
	res: express.Response<any, Record<string, any>, number>, 
	next: express.NextFunction): void;

export = normalizeSession;