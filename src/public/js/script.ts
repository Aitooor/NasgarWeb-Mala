import { RecomendedSelectorList, RecomendedSelectorListOptions } from './components/selector_list/selectorList.js';

;(() => {
  interface listItem {
    name: string;
    category: string;
  }

  const list: listItem[] = [
    // Generate a item list with name and category
    ...Array.from({ length: Math.floor(Math.random() * 10) + 1 }).map(() => ({
      name: `Item ${Math.floor(Math.random() * 100)}`,
      category: `Category ${Math.floor(Math.random() * 10)}`,
    })) 
  ];

  const options: RecomendedSelectorListOptions<listItem> = {
    list,
    properties: [{
      text: "Name",
      target: "name",
      style: "large",
    }, {
      text: "Category",
      target: "category",
      style: "medium",
    }],
    hint: "",
    target: document.querySelector("#Hola"),
    useOnInput: true,
    onSelect: (item: listItem) => {console.log(item)},
    onClose: () => {},
  }

  const selectorList = new RecomendedSelectorList<listItem>(options);
})();
