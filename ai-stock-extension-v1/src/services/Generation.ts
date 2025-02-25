import axios from "axios";

const Generation = {
  getRelatedStocks: async () => {
    try {
      // Retrieve page data from chrome.storage.local
      const pageData = await new Promise<{ title: string; url: string; content: string }>(
        (resolve, reject) => {
          chrome.storage.local.get(["pageData"], (data) => {
            if (!data.pageData) {
              console.warn("❌ No page data found.");
              alert("페이지 데이터가 없습니다.");
              reject("No page data available.");
              return;
            }
            resolve({
              title: data.pageData.title || "",
              url: data.pageData.url || "",
              content: data.pageData.content || "",
            });
          });
        }
      );

      

      // Send request using axios
      const response = await axios.post("http://127.0.0.1:8000/ai/stock/generation/", pageData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Response from FastAPI:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error sending request to FastAPI:", error);
      alert("AI 서버 요청에 실패했습니다.");
    }
  },
};

export default Generation;
