System.register(["./components/selector_list/selectorList.js"], function (exports_1, context_1) {
    "use strict";
    var selectorList_js_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (selectorList_js_1_1) {
                selectorList_js_1 = selectorList_js_1_1;
            }
        ],
        execute: function () {
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
                const selectorList = new selectorList_js_1.RecomendedSelectorList(options);
            })();
        }
    };
});
//# sourceMappingURL=script.js.map