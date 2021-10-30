import * as Language from "../../config/language";
import { Request, Response, NextFunction } from "express";

export default middleware;
export async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    let lang: Language.LanguageSchema = Language.DefaultLanguage;
    let langISO: Language.LanguageISO = Language.LanguageISO.Default;

    if(typeof req.query.lang === "string") {
        langISO = Language.getLanguageISO(req.query.lang);
        lang = await Language.getLanguage(langISO);
    } else
    if(typeof req.headers["accept-language"] === "string") {
        langISO = Language.getLanguageISO(req.headers["accept-language"]);
        lang = await Language.getLanguage(langISO);
    }

    res.locals.global.lang = lang;
    res.locals.global.langISO = langISO;

    next();
};