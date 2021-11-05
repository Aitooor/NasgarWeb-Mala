import { Request, Response, NextFunction } from "express";
export default middleware;
export declare function middleware(req: Request, res: Response, next: NextFunction): Promise<void>;
