import ElementList from "../components/list/list.js";

/** Template
 *
 * <div class="post" id="post1">
 *   <div class="post-header">
 *     <h2 class="post-title">
 *       <a href="/updates#post1">
 *         <%= post.title %>
 *       </a>
 *     </h2>
 *     <div class="post-meta">
 *       <span class="post-date">
 *         <%= post.date %>
 *       </span>
 *     </div>
 *   </div>
 *   <div class="post-content">
 *     <%- post.content.replace(/\n/g, "<br>") %>
 *   </div>
 * </div>
 *
 */

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

//#region List
const updatesList_Element: HTMLDivElement = <HTMLDivElement>(
  document.getElementById("update-list")
);
const updatesList = new ElementList(updatesList_Element, "/api/updates", {
  idTarget: "uuid",
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
    let inside = false;
    const md = markdownConverter.makeHtml(
      content
        .replace(/\n/g, "<br>\n")
        .replace(/\`\`\`.*\`\`\`/gm, (match) => {
          console.log(match);
          
          return match.replace(/\<br\>\n/gm, "\n");
        })
    );
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
//#endregion
