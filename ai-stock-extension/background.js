chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        }, () => {
            console.log("content.js executed. Now notifying popup.js");
            chrome.runtime.sendMessage({ action: "content_script_done" });
        });
    }
});
