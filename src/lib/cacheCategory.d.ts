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
export declare type CategoriesMap = CategoryCache[];
export interface CategoriesCache {
    lastUpdate: number;
    main: CategoryCache;
    categories: CategoriesMap;
    visible?: CategoriesMap;
}
export declare function save(json: CategoriesCache): void;
export declare function read(): CategoriesCache;
export declare function set(...categories: CategoryCache[]): CategoriesCache;
