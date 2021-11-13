import * as Utils from "./cacheUtils";
import * as Path from "path";

const file: string = Path.join(Utils.cacheDir, "category.json");

Utils.touchIf(file, JSON.stringify(<CategoriesCache>{
  lastUpdate: 0,
  categories: [],
}, undefined, 2))

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
  categories: CategoriesMap;
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
    categories: {
      ...oldJson.categories, 
      ...categories
    },
  };

  save(newJson);

  return newJson;
}

export function getByUUID(id: string): CategoryCache {
  return (
    read().categories[id] || null
  );
}

// export function getByUsername(username: string): CategoryCache {
//   for (const id in read().categories) {
//     if (Object.prototype.hasOwnProperty.call(read().categories, id)) {
//       const element = read().categories[id];
//       if(element.username === username)
//         return element
//     }
//   }
// }