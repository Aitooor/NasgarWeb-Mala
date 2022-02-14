import "../../common/common.js";
import Toast from "../../components/toasts.js";

let cart = [];

function initCategories() {
  const asideCategories = [...document.querySelectorAll("aside .category")];

  for (const asideCategory of asideCategories) {
    const header = asideCategory.querySelector(".category-header");

    if (!header || !header.addEventListener) {
      continue;
    }

    header.addEventListener("click", () => {
      try {
        const actual = asideCategory.classList.contains("active");

        for (const category of asideCategories) {
          category.classList.remove("active");
        }

        if (!actual) {
          asideCategory.classList.add("active");
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}

const CART = "shop_cart";

function initCart() {

  if (typeof window.localStorage[CART] !== "string") {
    cart = [];
    return;
  }

  cart = window.localStorage[CART].split(",").map((_) => {
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
  const addBasketButtons = [...document.querySelectorAll("button.add-basket")];

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
        } else {
          cart.push({
            uuid: productId,
            quantity: 1,
            gift: false,
          });
        }

        saveCart();
      } catch (e) {
        console.error(e);
      }
    });
  }
}

initCategories();
initCart();
initAddBasketButtons();
