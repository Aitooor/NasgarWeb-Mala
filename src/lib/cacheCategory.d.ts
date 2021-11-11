export interface CategoryCache {
    uuid: string;
    name: string;
    display: string;
    description: string;
    image: string;
    min_rank: number;
    public: boolean;
    order: string[];
}
export declare type CategoriesMap = {
    [key: string]: CategoryCache;
};
export interface CategoriesCache {
    categories: CategoriesMap;
}
export declare function save(json: CategoriesCache): void;
export declare function read(): CategoriesCache;
export declare function set(...categories: CategoryCache[]): CategoriesCache;
export declare function getByUUID(id: string): CategoryCache;
