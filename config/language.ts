import EnglishLanguage from "./language/en.json";
export const DefaultLanguage = EnglishLanguage;
export type LanguageSchema = typeof EnglishLanguage;
export type LanguageList = string;

function generateLanguageRegExp(iso: string, name: string): RegExp {
    return new RegExp(`${iso}(-[A-Z]{2})?|${name}`, "i");
}

const englishPattern: RegExp = generateLanguageRegExp("en", "english");
const spanishPattern: RegExp = generateLanguageRegExp("es", "spanish");


export default getLanguage;
export async function getLanguage(lang: LanguageList): Promise<LanguageSchema> {
    if(lang === "default") 
        return DefaultLanguage;

    if(lang.match(englishPattern))
        return EnglishLanguage;
    
    if(lang.match(spanishPattern))
        return pollyfillLanguage(await importLanguage("es"));

    return DefaultLanguage;
}

function importLanguage(str: string): Promise<LanguageSchema> {
    return import(`./language/${str}.json`);
}

function pollyfillLanguage(json: Object): LanguageSchema {
    let res: LanguageSchema = JSON.parse(JSON.stringify(json));

    // Pollyfill chunk
    function pollyfill_(obj: Object, compare: Object): any {
        for(let key in compare) {
            // If both types are different then use `compare.key`
            // else pollyfill `obj.key`
            if(typeof compare[key] === typeof obj[key]) {
                if(typeof compare[key] === "object") {
                    obj[key] = pollyfill_(obj[key], compare[key]);
                } else {
                    continue;
                }
            } else {
                if(typeof compare[key] === "object") {
                    obj[key] = JSON.parse(JSON.stringify(compare[key]));
                } else {
                    obj[key] = compare[key];
                }
            }
        }

        return obj;
    }

    res = pollyfill_(res, EnglishLanguage);

    return res;
}

export enum LanguageISO {
    Default = "en-US",
    English = "en-US",
    Spanish = "es-ES"
}

export function getLanguageISO(str: string): LanguageISO {
    if(str.match(englishPattern))
        return LanguageISO.English;
    
    if(str.match(spanishPattern)) 
        return LanguageISO.Spanish;
    
    return LanguageISO.Default;
}