System.register(["../components/list/listPaginator.js"], function (exports_1, context_1) {
    "use strict";
    var _a, listPaginator_js_1, paginationClass, showdown, markdownConverter, url, page, updatesList_Element, updatesList;
    var __moduleName = context_1 && context_1.id;
    function normalizeNumber(num) {
        if (num < 10) {
            return "0" + num;
        }
        return num.toString();
    }
    return {
        setters: [
            function (listPaginator_js_1_1) {
                listPaginator_js_1 = listPaginator_js_1_1;
            }
        ],
        execute: function () {
            paginationClass = "list-paginator__";
            showdown = window.showdown;
            markdownConverter = new showdown.Converter();
            markdownConverter.setOption("openLinksInNewWindow", true);
            markdownConverter.setOption("noHeaderId", true);
            url = new URL(location.href);
            page = parseInt(((_a = url.hash.match(/^#page:(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1]) || "0");
            updatesList_Element = (document.getElementById("update-list"));
            updatesList = new listPaginator_js_1.ElementListPaginator(updatesList_Element, "/api/news", {
                idTarget: "uuid",
                elements: {
                    prev: document.querySelector(`.${paginationClass}prev`),
                    next: document.querySelector(`.${paginationClass}next`),
                    list: document.querySelector(`.${paginationClass}pages`),
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
                formatDate: (date) => {
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
                    return `${normalizeNumber(d.getDate())}/${months[d.getMonth()]}/${d.getFullYear()}`;
                },
                formatContent: (content) => {
                    const toRender = content
                        .replace(/\n/g, "<br>\n")
                        .replace(/\`\`\`.*\`\`\`/gm, (match) => {
                        return match.replace(/\<br\>\n/gm, "\n");
                    });
                    const md = markdownConverter.makeHtml(toRender.length < 500 ? toRender : toRender.substring(0, 500) + "...");
                    return md;
                },
                formatHref: (uuid) => {
                    return "/news/" + uuid;
                },
            }).pipe((ev, args) => {
                if (ev === "page:change") {
                    console.log(args);
                    window.history.pushState({}, "", "/news#page:" + args);
                    updatesList.setPage(args);
                    window.scrollTo(0, 0);
                }
            }).setTemplate(`
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
                var _a;
                const url = new URL(location.href);
                const page = parseInt(((_a = url.hash.match(/^#page:(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1]) || "0");
                updatesList.setPage(page);
                window.scrollTo(0, 0);
            };
            updatesList.refresh();
        }
    };
});
//# sourceMappingURL=updates.js.map