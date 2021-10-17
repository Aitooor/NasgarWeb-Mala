import { Level as _Level } from "../@types/userLevel";
import { NextFunction, Request, Response } from "express";
import { get, add } from "../lib/jwt"

type req = Request;
type res = Response;

type userLevelMidd = (request: req, response: res, next: NextFunction) => void; 

interface userLevelOptions {
  redirect?: boolean;
  authPage?: string | ((request: Request, response: Response) => void);
  moreThan?: boolean;
  exclude?: _Level[];
}

export const Level = _Level

export function setLevel(level: _Level, req: Request, res: Response) {
  add({ userLevel: level }, req, res);
}

export default middleware
export function middleware(levels: _Level | _Level[], options?: userLevelOptions): userLevelMidd {
  return (request: req, response: res, next: NextFunction) => {
    // If it has nasgar.userLevel then continue
    const info = get(request);

    if(info !== null &&
       typeof info === "object" && 
       typeof info.userLevel === "number" ) {
      const uLevel = info.userLevel;
      
      // Normalize to array
      if(!Array.isArray(levels))
        levels = [levels];

      if(options?.moreThan !== false) {
        const min = Math.min(...levels);
        if(uLevel >= min)
          if(Array.isArray(options?.exclude) &&
             !options.exclude.includes(uLevel))
            return next();
          else
            return next();
      } else {
        if(levels.includes(uLevel))
          if(Array.isArray(options?.exclude) &&
             !options.exclude.includes(uLevel))
            return next();
          else
            return next();
      }
    } else 
    if(info === null && (levels === Level.Default || (Array.isArray(levels) && levels.includes(Level.Default)))) {
      return next();
    }

    // Else redirect to auth or send status
    if(options?.redirect !== false) {
      const query = "next=" + encodeURIComponent(request.originalUrl);
      
      if(typeof options?.authPage === "string") {
        response.redirect(`${options.authPage}?${query}`);
      } else 
      if(typeof options?.authPage === "function") {
        request.query = {
          next: request.originalUrl
        };
        options.authPage(request, response);
      } else {
        response.redirect(`/login?${query}`);
      }
    } else {
      response.sendStatus(403);
    }
  } 
}
