import * as Utils from "./cacheUtils";
import * as Path from "path";

const file: string = Path.join(Utils.cacheDir, "category.json");

Utils.touchIf(file, JSON.stringify({
  lastUpdate: 0,
  main: {},
  categories: [],
  visible: [],
} as CategoriesCache, undefined, 2))

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

export type CategoriesMap = CategoryCache[];

export interface CategoriesCache {
  lastUpdate: number;
  main: CategoryCache;
  categories: CategoriesMap;
  visible?: CategoriesMap;
}

export function save(json: CategoriesCache) {
  Utils.writeFile(
    file,
    process.env.NODE_ENV === "production"
      ? JSON.stringify(json)
      : JSON.stringify(json, undefined, 2)
  );
}

export function read(): CategoriesCache {
  const json = Utils.readFile(file);
  if(json.length === 0) return null;
  return JSON.parse(json)
}

export function set(...categories: CategoryCache[]): CategoriesCache {
  const oldJson: CategoriesCache = read();
  const newJson: CategoriesCache = {
    lastUpdate: Date.now(),
    main: oldJson.main,
    categories: {
      ...oldJson.categories, 
      ...categories
    },
    visible: oldJson.visible
  };

  save(newJson);

  return newJson;
}
