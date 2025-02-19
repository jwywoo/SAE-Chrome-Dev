document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Popup opened. Fetching stored data...");

    chrome.storage.local.get(["pageData", "jwtToken"], (data) => {
        if (data.pageData) {
            document.getElementById("page-title").textContent = `Title: ${data.pageData.title}`;
            document.getElementById("page-url").textContent = `URL: ${data.pageData.url}`;
            document.getElementById("page-html").value = data.pageData.content;

            sendToFastAPI(data.pageData);
        }
    });
});

async function sendToFastAPI(pageData) {
    try {
        const requestBody = {
            title: pageData.title || "",
            url: pageData.url || "",
            content: pageData.content || ""
        };

        console.log("📡 Sending request to FastAPI:", requestBody);

        const response = await axios.post("http://127.0.0.1:8000/ai/stock/generation/", requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("✅ Response from FastAPI:", response.data);
        displayAIResponse(response.data);
    } catch (error) {
        console.error("❌ Error sending data to FastAPI:", error);
    }
}

function displayAIResponse(apiResponse) {
    const apiResponseContainer = document.getElementById("api-response") || document.createElement("div");
    apiResponseContainer.id = "api-response";
    apiResponseContainer.innerHTML = "<h3>AI Suggested Stocks</h3>";

    if (apiResponse.status === 1 && apiResponse.generated_stocks.length > 0) {
        const stockList = document.createElement("ul");
        apiResponse.generated_stocks.forEach(stock => {
            const listItem = document.createElement("li");
            listItem.textContent = `${stock.stock_name} (${stock.ticker_symbol}) - ${stock.market_name}`;

            // Create a "Save" button next to each stock
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";

            // Fix: Prevent popup from closing
            saveButton.addEventListener("click", (event) => {
                event.stopPropagation();  // Prevents event bubbling
                event.preventDefault();   // Prevents popup closing
                saveStock(stock);
            });

            listItem.appendChild(saveButton);
            stockList.appendChild(listItem);
        });

        apiResponseContainer.appendChild(stockList);
    } else {
        apiResponseContainer.innerHTML += "<p>No stocks generated.</p>";
    }

    document.body.appendChild(apiResponseContainer);
}

function saveStock(stock) {
    console.log("✅ Save button clicked!");
    console.log("📝 Stock details:", JSON.stringify(stock, null, 2));

    // Check for JWT token in chrome storage
    chrome.storage.local.get(["jwtToken"], (data) => {
        if (!data.jwtToken) {
            console.warn("❌ User is not authenticated. Redirecting to login...");

            // Get the active tab ID
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const activeTabId = tabs[0].id;
                console.log("✅ Active tab ID captured:", activeTabId);

                // Send the active tab ID to background.js
                chrome.runtime.sendMessage({
                    action: "redirectToLogin",
                    url: "http://localhost:8080/api/members/google/login",
                    saveTabId: activeTabId
                });
            });

            return;
        }

        console.log("✅ User is authenticated. Proceeding to save stock...");

        const tickerCode = stock.ticker_symbol;
        console.log("📡 Ticker Code:", tickerCode);

        // Send stock data to Spring Backend
        axios.post(`http://localhost:8080/api/members/base/stock/${tickerCode}`, {}, {
            headers: {
                "Authorization": `Bearer ${data.jwtToken}`
            }
        }).then(response => {
            console.log("✅ Stock saved successfully:", response.data);
            alert("Stock saved successfully!");
        }).catch(error => {
            console.error("❌ Error saving stock:", error);
        });
    });
}
