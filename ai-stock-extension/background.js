// Keep existing listener
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


let saveTabId = null;
let authTabId = null;

// Listen for messages to open Google login in a new tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "redirectToLogin") {
        console.log("🔗 [BG] Redirecting to Google login:", request.url);

        // Capture the ID of the tab where the Save button was clicked
        if (request.saveTabId) {
            saveTabId = request.saveTabId;
            console.log("✅ [BG] Save tab ID received:", saveTabId);
        }

        // Open Google login in a new tab and store the tab ID
        chrome.tabs.create({ url: request.url }, (tab) => {
            authTabId = tab.id;
            console.log("✅ [BG] Google login tab opened with ID:", authTabId);
        });
    }
});

// Intercept response headers from Spring Backend
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        console.log("📡 [BG] Response headers received:", details.responseHeaders);

        // Extract the Authorization token from headers
        const authorizationHeader = details.responseHeaders.find(header => 
            header.name.toLowerCase() === "authorization"
        );

        if (authorizationHeader) {
            let token = authorizationHeader.value;
            // console.log("✅ [BG] Raw Authorization Header:", token);

            // If the token is prefixed with "Bearer ", strip it out
            if (token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
                // console.log("✅ [BG] Cleaned Token:", token);
            }

            chrome.storage.local.set({ jwtToken: token }, () => {
                console.log("✅ [BG] JWT token stored in chrome.storage.local:");
            });

            // Close the authentication tab and switch back to the save tab
            if (authTabId) {
                chrome.tabs.remove(authTabId, () => {
                    console.log("✅ [BG] Google login tab closed:", authTabId);
                    authTabId = null; // Reset the stored tab ID

                    // Check if the save tab is still open
                    if (saveTabId) {
                        chrome.tabs.get(saveTabId, (tab) => {
                            if (chrome.runtime.lastError || !tab) {
                                console.warn("⚠️ [BG] Save tab not found or already closed.");
                            } else {
                                // Switch back to the save tab
                                chrome.tabs.update(saveTabId, { active: true }, () => {
                                    console.log("✅ [BG] Switched back to save tab:", saveTabId);
                                    saveTabId = null; // Reset the stored tab ID
                                });
                            }
                        });
                    } else {
                        console.warn("⚠️ [BG] No saveTabId to switch back to.");
                    }
                });
            }
        } else {
            console.warn("⚠️ [BG] Authorization Token not found in response headers.");
        }
    },
    { urls: ["http://localhost:8080/api/members/google/callback*"] },
    ["responseHeaders"]
);
