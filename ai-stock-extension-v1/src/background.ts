chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension Installed");
});

// ✅ Ignore `sender` by using `_` as a placeholder
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "redirectToLogin") {
    chrome.tabs.create({ url: request.url });
    sendResponse({ status: "redirecting" });
  }
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "saveToken") {
    chrome.storage.local.set({ jwt: request.token }, () => {
      console.log("✅ Token stored successfully!");
    });
    sendResponse({ status: "success" });
  }
});

