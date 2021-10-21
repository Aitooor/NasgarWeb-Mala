import EnglishLanguage from "./language/en.json";
export declare const DefaultLanguage: {
    $schema: string;
    name: {
        english: string;
        native: string;
    };
    menu: {
        home: string;
        updates: string;
        bans: string;
        vote: string;
        login: string;
        shop: {
            title: string;
            keys: string;
            ranks: string;
        };
    };
    landing: {
        description: string;
        about: {
            title: string;
            content: string;
        };
        team: string;
    };
};
export declare type LanguageSchema = typeof EnglishLanguage;
export declare type LanguageList = string;
export default getLanguage;
export declare function getLanguage(lang: LanguageList): Promise<LanguageSchema>;
export declare enum LanguageISO {
    Default = "en-US",
    English = "en-US",
    Spanish = "es-ES"
}
export declare function getLanguageISO(str: string): LanguageISO;
