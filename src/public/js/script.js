import { RecomendedSelectorList } from './components/selector_list/selectorList.js';
;
(() => {
    const list = [
        ...Array.from({ length: Math.floor(Math.random() * 10) + 1 }).map(() => ({
            name: `Item ${Math.floor(Math.random() * 100)}`,
            category: `Category ${Math.floor(Math.random() * 10)}`,
        }))
    ];
    const options = {
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
        onSelect: (item) => { console.log(item); },
        onClose: () => { },
    };
    const selectorList = new RecomendedSelectorList(options);
})();
//# sourceMappingURL=script.js.map