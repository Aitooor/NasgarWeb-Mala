import { ElementListPaginator } from "../components/list/listPaginator.js";

const paginationClass = "list-paginator__";

function normalizeNumber(num: number): string {
  if (num < 10) {
    return "0" + num;
  }
  return num.toString();
}

// @ts-ignore
const showdown = window.showdown;

//#region markdown
const markdownConverter = new showdown.Converter();
markdownConverter.setOption("openLinksInNewWindow", true);
markdownConverter.setOption("noHeaderId", true);
//#endregion

const url = new URL(location.href);
const page = parseInt(url.hash.match(/^#page:(\d+)$/)?.[1] || "0");

//#region List
const updatesList_Element: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("update-list")
);
const updatesList = new ElementListPaginator(updatesList_Element, "/api/news", {
  idTarget: "uuid",
  elements: {
    prev: document.querySelector(
      `.${paginationClass}prev`
    ) as HTMLButtonElement,
    next: document.querySelector(
      `.${paginationClass}next`
    ) as HTMLButtonElement,
    list: document.querySelector(`.${paginationClass}pages`) as HTMLDivElement,
  },
  page: page,
  pageSize: 4,
  maxButtons: 8,
  classes: {
    page: paginationClass + "page",
    dots: paginationClass + "dots",
    selected: paginationClass + "page--selected",
    disabled: paginationClass + "disabled",
  },
}).setCustomFunctions({
  formatDate: (date: number) => {
    const d = new Date(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${normalizeNumber(d.getDate())}/${
      months[d.getMonth()]
    }/${d.getFullYear()}`;
  },

  formatContent: (content: string) => {
    const toRender = content
      .replace(/\n/g, "<br>\n")
      .replace(/\`\`\`.*\`\`\`/gm, (match) => {
        return match.replace(/\<br\>\n/gm, "\n");
      });
    const md = markdownConverter.makeHtml(
      toRender.length < 500 ? toRender : toRender.substring(0, 500) + "..."
    );
    return md;
  },
  formatHref: (uuid: string) => {
    return "/news/" + uuid;
  },
}).pipe((ev, args) => {
  if(ev === "page:change") {
    console.log(args);
    window.history.pushState({}, "", "/news#page:" + args);
    updatesList.setPage(args);
    window.scrollTo(0, 0);
  }
}).setTemplate(/*html*/ `
<a slot="uuid" data-slot-attribute="href" data-slot-formatter="formatHref" class="post">
  <div class="post-header">
    <h2 class="post-title" slot="title">
    </h2>
    <div class="post-meta">
      <span class="post-date" slot="date" data-slot-formatter="formatDate"></span>
    </div>
  </div>

  <div class="post-content" slot="content" data-slot-formatter="formatContent">
  </div>
</a>`);

window.onpopstate = () => {
  const url = new URL(location.href);
  const page = parseInt(url.hash.match(/^#page:(\d+)$/)?.[1] || "0");
  updatesList.setPage(page);
  window.scrollTo(0, 0);
};

updatesList.refresh();
//#endregion
