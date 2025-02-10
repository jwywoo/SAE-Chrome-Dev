document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.getElementById("page-title");
    const pageUrl = document.getElementById("page-url");
    const pageHtml = document.getElementById("page-html");

    chrome.storage.local.get("pageData", (data) => {
        if (data.pageData) {
            pageTitle.textContent = `Title: ${data.pageData.title}`;
            pageUrl.textContent = `URL: ${data.pageData.url}`;
            pageHtml.value = data.pageData.html;  // Display full page's HTML
        }
    });
});
