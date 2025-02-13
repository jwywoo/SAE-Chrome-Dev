(() => {
    function collectPageData() {
        if (document.readyState === "complete") {
            extractText();
        } else {
            window.addEventListener("load", extractText);
        }
    }

    function extractText() {
        const pageData = {
            title: document.title,
            url: window.location.href,
            content: document.body.innerText // Now runs only after full page load
        };

        chrome.storage.local.set({ pageData }, () => {
            console.log("✅ Page data stored:", pageData);
            chrome.runtime.sendMessage({ action: "page_data_stored" });
        });
    }

    collectPageData();
})();
