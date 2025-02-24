const Storage = {
  getPageData: (): Promise<{ title: string; url: string; content: string }> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(["pageData"], (data) => {
        console.log("✅ Fetched page data:", data.pageData);
        resolve(
          data.pageData || { title: "Unknown", url: "Unknown", content: "No content available" }
        );
      });
    });
  },

  refreshData: () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            console.log("⏳ Waiting 2 seconds before collecting page data...");

            setTimeout(() => {
              console.log("✅ 2 seconds passed. Collecting page data...");
              const pageData = {
                title: document.title,
                url: window.location.href,
                content: document.body.innerText
              };

              chrome.storage.local.set({ pageData }, () => {
                console.log("✅ Page data refreshed after 2 seconds:", pageData);
              });
            }, 2000);
          },
        }
      );
    });
  },
};

export default Storage;
