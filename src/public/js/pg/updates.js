import ElementList from "../components/list/list.js";
function normalizeNumber(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num.toString();
}
const showdown = window.showdown;
const markdownConverter = new showdown.Converter();
markdownConverter.setOption("openLinksInNewWindow", true);
markdownConverter.setOption("noHeaderId", true);
const updatesList_Element = (document.getElementById("update-list"));
const updatesList = new ElementList(updatesList_Element, "/api/news", {
    idTarget: "uuid",
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
updatesList.refresh();
//# sourceMappingURL=updates.js.map