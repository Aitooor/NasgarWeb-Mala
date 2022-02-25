import Toast from "../../components/toasts.js";
let resGlobal;

interface Flickity {
  new (
    element: HTMLElement,
    options: {
      draggable?: boolean;
      freeScroll?: boolean;
      lazyLoad?: boolean | number;
      fullscreen?: boolean;
      cellAlign?: "left" | "center" | "right";
    }
  ): Flickity;

  append(element: HTMLElement): void;
}

// @ts-ignore - Showdown is not typed
const showdown = window.showdown;

//#region markdown
const markdownConverter = new showdown.Converter();
markdownConverter.setOption("openLinksInNewWindow", true);
markdownConverter.setOption("noHeaderId", true);
//#endregion

declare global {
  interface Window {
    productUUID: string;
    Flickity: Flickity;
  }
}

fetch("/api/get/product/" + window.productUUID)
  .then((res) => {
    if (res.ok) {
      return res;
    } else {
      throw res;
    }
  })
  .then((res) => res.json())
  .then((res) => (resGlobal = res))
  .then(setInfo)
  .catch(_catch);

function _catch(err) {
  if (err instanceof Response) {
    if (err.status === 404 || err.status === 400) {
      new Toast({
        title: "Error",
        body: "El producto no existe",
      }).show();

      setTimeout(() => {
        window.open("/shop", "_self");
      }, 1000);
      return;
    } else {
      new Toast({
        title: "Error",
        body: "Hubo un error al cargar el producto",
      }).show();
      // try again
    }
  } else {
    new Toast({
      title: "Error",
      body: "Hubo un error al cargar el producto",
    }).show(900);
  }

  setTimeout(() => {
    try {
      setInfo(resGlobal);
    } catch (err) {
      _catch(err);
    }
  }, 1000);
}

function setInfo(res) {
  document.querySelector("main.product").classList.remove("loading");
  document.querySelector(".product-name").innerHTML = res.name;
  document.querySelector(".product-price").innerHTML = monetize(res.price);
  document.querySelector(".product-description").innerHTML = renderMD(res.description);
  const images_dom = document.querySelector(
    ".product-images"
  ) as HTMLDivElement;
  const images_flickity = new window.Flickity(images_dom, {
    lazyLoad: 1,
    fullscreen: true,
    cellAlign: "center",
  });

  const images = res.images.length === 0 ? ["No image"] : res.images;

  for (let image of images) {
    const dom = document.createElement("div");
    dom.className = "image-cell";
    const img = new Image();
    img.dataset.flickityLazyloadSrc = image;

    dom.append(img);
    dom.append(document.createElement("span"));

    images_flickity.append(dom);
  }

  document.title = `${res.name} - Nasgar Network`;

  const addToCart = () => {
    const CART = "shop_cart";
    if (localStorage[CART] && localStorage[CART] != "") {
      const _cart = localStorage[CART];
      const old_cart = _cart.split(",").reduce((obj, _) => {
        const pr = _.split(":");
        obj[pr[0]] = {
          q: parseInt(pr[1]),
          g:
            pr[2] == "false" || pr[2] == "undefined" || pr[2] == undefined
              ? false
              : pr[2],
        };
        return obj;
      }, {});

      if (old_cart[window.productUUID]) old_cart[window.productUUID].q++;
      else
        old_cart[window.productUUID] = {
          q: 1,
          g: false,
        };

      const new_cart = Object.keys(old_cart).map((_) => {
        return _ + ":" + old_cart[_].q + ":" + old_cart[_].g;
      });

      localStorage[CART] = new_cart.join(",");
    } else {
      localStorage[CART] = `${window.productUUID}:1`;
    }
  };

  document.querySelector(".buy-btn").addEventListener("click", () => {
    addToCart();
    window.open("/shop/cart", "_self");
  });

  document.querySelector(".cart-btn").addEventListener("click", () => {
    addToCart();
    new Toast({
      title: "Añadido al carrito",
      body: `<b>${res.name}</b> fue añadido al carrito exitosamente.`,
      actions: [{ html: "Cerrar", action: "close", actionArgs: ["@me"] }],
    }).show();
  });
}

function renderMD(content: string): string {
  const toRender = content
    .replace(/\n/g, "<br>\n")
    .replace(/\`\`\`.*\`\`\`/gm, (match) => {
      return match.replace(/\<br\>\n/gm, "\n");
    });
  const md = markdownConverter.makeHtml(toRender);
  return md;
}

/**
 *
 * @param {number} money
 * @return {string} Formated money
 */
function monetize(money) {
  if (typeof money !== "number") return "0.00";
  const moneyStr = money.toLocaleString("en");
  const sep = moneyStr.split(".");
  const cents =
    sep.length === 1 ? "00" : sep[1].length === 1 ? sep[1] + "0" : sep[1];
  return sep[0] + "." + cents;
}
