import { Level as _Level } from "../@types/userLevel";
import { NextFunction, Request, Response } from "express";
declare type req = Request;
declare type res = Response;
declare type userLevelMidd = (request: req, response: res, next: NextFunction) => void;
interface userLevelOptions {
    redirect?: boolean;
    authPage?: string | ((request: Request, response: Response) => void);
    moreThan?: boolean;
    exclude?: _Level[];
}
export declare const Level: typeof _Level;
export declare function setLevel(level: _Level, req: Request, res: Response): void;
export default middleware;
export declare function middleware(levels: _Level | _Level[], options?: userLevelOptions): userLevelMidd;
