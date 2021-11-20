import {
  RecomendedSelectorList,
  RecomendedSelectorListOptions,
} from "./components/selector_list/selectorList.js";

(() => {
  interface listItem {
    name: string;
    category: string;
  }

  const list: listItem[] = [
    // Generate a item list with name and category
    ...Array.from({ length: Math.floor(Math.random() * 8) + 3 }).map(() => ({
      name: `Item ${Math.floor(Math.random() * 100)}`,
      category: `@${Math.floor(Math.random() * 10)}`,
    })),
  ];

  const options: RecomendedSelectorListOptions<listItem> = {
    list,
    properties: [
      {
        text: "",
        target: "id",
        style: "small",
        visible: false,
      },
      {
        text: "Name",
        target: "name",
        style: "large",
      },
      {
        text: "Category",
        target: "category",
        style: "medium",
        regex: /^@\d+/,
      },
    ],
    hint: `
    Use <span class="text-style-code"><span class="code-comment">NAME</span></span> to name, 
    and <span class="text-style-code"><span class="code-active">@</span><span class="code-comment">CATEGORY</span></span> 
    to categories.`,
    target: <HTMLElement>document.querySelector("#Hola"),
    useOnInput: true,
    onSelect: (item: listItem) => {
      console.log(item);
    },
    onClose: () => {},
  };

  const selectorList = new RecomendedSelectorList<listItem>(options);
})();
