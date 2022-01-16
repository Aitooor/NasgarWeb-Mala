const updateUUID = window.updateUUID;
const showdown = window.showdown;
const markdownConverter = new showdown.Converter();
markdownConverter.setOption("openLinksInNewWindow", true);
markdownConverter.setOption("noHeaderId", true);
function renderMD(content) {
    const toRender = content
        .replace(/\n/g, "<br>\n")
        .replace(/\`\`\`.*\`\`\`/gm, (match) => {
        return match.replace(/\<br\>\n/gm, "\n");
    });
    const md = markdownConverter.makeHtml(toRender);
    return md;
}
function formatDate(date) {
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
    return `${d.getDate().toString().padStart(2, "0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
}
fetch("/api/news/" + updateUUID)
    .then((response) => response.json())
    .then((data) => {
    const update = data;
    const updateTitle = document.querySelector(".post-title");
    const updateDate = document.querySelector(".post-date");
    const updateContent = document.querySelector(".post-content");
    updateTitle.innerHTML = update.title;
    updateDate.innerHTML = formatDate(update.date);
    updateContent.innerHTML = renderMD(update.content);
});
//# sourceMappingURL=update.js.map