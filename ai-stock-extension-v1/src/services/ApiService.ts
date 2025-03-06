import axios from "axios";

const ApiService = {
  saveData: async (pageData: {title: String, url: String, content: String}) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/ai/stock/test/", pageData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; 
    } catch (error) {
      console.error("❌ Error sending page data:", error);
      throw error; // Rethrow for handling elsewhere
    }
  },

  saveStock: async (stock: { stock_name: string; ticker_symbol: string; market_name: string }) => {
    console.log("✅ Save button clicked!", stock);

    try {
      // Retrieve JWT token from Chrome storage
      const token = await new Promise<string | null>((resolve) => {
        chrome.storage.local.get(["jwt"], (data) => {
          resolve(data.jwt || null);
        });
      });

      if (!token) {
        console.warn("❌ User is not authenticated. Redirecting to login...");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTabId = tabs[0].id;
          chrome.runtime.sendMessage({
            action: "redirectToLogin",
            url: "http://localhost:8080/api/members/google/login",
            saveTabId: activeTabId,
          });
        });
        return;
      }

      console.log("✅ User is authenticated. Saving stock...");

      // Send request using Axios
      const response = await axios.post(
        `http://localhost:8080/api/members/base/stock/${stock.ticker_symbol}`,
        {}, // No body needed
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("✅ Stock saved successfully:", response.data);
      alert("Stock saved successfully!");
    } catch (error) {
      console.error("❌ Error saving stock:", error);
      alert("Failed to save stock.");
    }
  },
};

export default ApiService;
