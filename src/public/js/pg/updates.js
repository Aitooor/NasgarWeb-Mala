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
const updatesList = new ElementList(updatesList_Element, "/api/updates", {
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
        let inside = false;
        const md = markdownConverter.makeHtml(content
            .replace(/\n/g, "<br>\n")
            .replace(/\`\`\`.*\`\`\`/gm, (match) => {
            console.log(match);
            return match.replace(/\<br\>\n/gm, "\n");
        }));
        return md;
    },
}).setTemplate(`
<div class="post">
  <div class="post-header">
    <h2 class="post-title" slot="title">
    </h2>
    <div class="post-meta">
      <span class="post-date" slot="date" data-slot-formatter="formatDate"></span>
    </div>
  </div>

  <div class="post-content" slot="content" data-slot-formatter="formatContent">
  </div>
</div>`);
updatesList.refresh();
//# sourceMappingURL=updates.js.map