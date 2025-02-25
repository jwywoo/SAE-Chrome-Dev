console.log("✅ Content script injected. Waiting 2 seconds before collecting page data...");

setTimeout(() => {
  console.log("⏳ 2 seconds passed. Collecting page data...");

  const pageData = {
    title: document.title,
    url: window.location.href,
    content: document.body.innerText
  };

  chrome.storage.local.set({ pageData }, () => {
    console.log("✅ Page data saved after 2 seconds:", pageData);
  });
}, 2000);


window.addEventListener("message", (event) => {
  if (event.source !== window) return; // Ensure it's from the same page
  if (event.data.action === "saveToken") {
    // ✅ Save token inside Chrome Extension storage
    chrome.runtime.sendMessage({ action: "saveToken", token: event.data.token });
  }
});
