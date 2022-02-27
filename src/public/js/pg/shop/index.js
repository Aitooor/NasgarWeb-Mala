System.register(["../../common/common.js"], function (exports_1, context_1) {
    "use strict";
    var categoryDescription, $categoryDescription, cart, CART;
    var __moduleName = context_1 && context_1.id;
    function initCategories() {
        const asideCategories = [...document.querySelectorAll("aside .category")];
        for (const asideCategory of asideCategories) {
            const parent = asideCategory.parentElement.parentElement.classList.contains("category")
                ? asideCategory.parentElement.parentElement
                : null;
            const header = asideCategory.querySelector(".category-header");
            const content = asideCategory.querySelector(".category-content");
            if (!header || !content || !header.addEventListener) {
                continue;
            }
            header.addEventListener("click", () => {
                try {
                    const actual = asideCategory.classList.contains("active");
                    const isParentActive = parent && parent.classList.contains("active");
                    for (const category of asideCategories) {
                        category.classList.remove("active");
                        header.classList.remove("active");
                        content.classList.remove("active");
                    }
                    if (!actual) {
                        asideCategory.classList.add("active");
                        header.classList.add("active");
                        content.classList.add("active");
                        if (parent) {
                            parent.classList.add("active");
                        }
                    }
                    else if (isParentActive) {
                        parent.classList.add("active");
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
    function initCart() {
        if (typeof window.localStorage[CART] !== "string") {
            cart = [];
            return;
        }
        cart =
            window.localStorage[CART].split(",").map((_) => {
                const p = _.split(":");
                return {
                    uuid: p[0],
                    quantity: parseInt(p[1]),
                    gift: p[2] !== "false" && p[2] !== undefined ? p[2] : false,
                };
            }) || [];
    }
    function saveCart() {
        window.localStorage[CART] = cart
            .map((_) => _.uuid + ":" + _.quantity + ":" + _.gift)
            .join(",");
    }
    function initAddBasketButtons() {
        const addBasketButtons = [
            ...document.querySelectorAll("button.add-basket"),
        ];
        for (const addBasketButton of addBasketButtons) {
            if (!addBasketButton.addEventListener) {
                continue;
            }
            addBasketButton.addEventListener("click", () => {
                try {
                    const productId = addBasketButton.dataset.productId;
                    if (!productId) {
                        throw new Error("No product id");
                    }
                    const hasAlready = cart.find((_) => _.uuid === productId);
                    if (hasAlready) {
                        hasAlready.quantity++;
                    }
                    else {
                        cart.push({
                            uuid: productId,
                            quantity: 1,
                            gift: false,
                        });
                    }
                    saveCart();
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
    return {
        setters: [
            function (_1) {
            }
        ],
        execute: function () {
            categoryDescription = window.description;
            $categoryDescription = document.querySelector("#category-description");
            {
                const showdown = window.showdown;
                const markdownConverter = new showdown.Converter();
                markdownConverter.setOption("openLinksInNewWindow", true);
                markdownConverter.setOption("noHeaderId", true);
                const md = categoryDescription
                    .replace(/\n/g, "<br>\n")
                    .replace(/\`\`\`.*\`\`\`/gm, (match) => {
                    return match.replace(/\<br\>\n/gm, "\n");
                });
                $categoryDescription.innerHTML = markdownConverter.makeHtml(md);
            }
            cart = [];
            CART = "shop_cart";
            initCategories();
            initCart();
            initAddBasketButtons();
        }
    };
});
//# sourceMappingURL=index.js.map