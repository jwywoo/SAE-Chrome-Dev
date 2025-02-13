document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Popup opened. Fetching stored data...");

    chrome.storage.local.get("pageData", (data) => {
        if (data.pageData) {
            document.getElementById("page-title").textContent = `Title: ${data.pageData.title}`;
            document.getElementById("page-url").textContent = `URL: ${data.pageData.url}`;
            document.getElementById("page-html").value = data.pageData.content;

            // Send the data to FastAPI
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

        console.log("📡 Sending request to FastAPI:", requestBody); // Debugging log

        const response = await fetch("http://127.0.0.1:8000/ai/stock/generation/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorResponse}`);
        }

        const result = await response.json();
        console.log("✅ Response from FastAPI:", result);

        displayAIResponse(result);

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
            stockList.appendChild(listItem);
        });
        apiResponseContainer.appendChild(stockList);
    } else {
        apiResponseContainer.innerHTML += "<p>No stocks generated.</p>";
    }

    document.body.appendChild(apiResponseContainer);
}