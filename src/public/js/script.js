import { RecomendedSelectorList, } from "./components/selector_list/selectorList.js";
(() => {
    const list = [
        ...Array.from({ length: Math.floor(Math.random() * 8) + 3 }).map(() => ({
            name: `Item ${Math.floor(Math.random() * 100)}`,
            category: `@${Math.floor(Math.random() * 10)}`,
        })),
    ];
    const options = {
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
    Use <span class="text-style-code"><span class="code-comment">NAME</span></span> or <span class="text-style-code"><span class="code-active">@</span><span class="code-comment">CATEGORY</span></span> 
    to filter search.`,
        target: document.querySelector("#Hola"),
        useOnInput: true,
        onSelect: (item) => {
            console.log(item);
        },
        onClose: () => { },
    };
    const selectorList = new RecomendedSelectorList(options);
})();
//# sourceMappingURL=script.js.map