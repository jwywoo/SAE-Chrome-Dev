console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome extension installed");
});
