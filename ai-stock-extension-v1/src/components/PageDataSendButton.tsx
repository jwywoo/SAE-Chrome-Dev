import ApiService from "../services/ApiService";
import { Button } from "@mui/material";
const PageDataSendButton = () => {
    const handleClick = async () => {
        try {
            // Retrieve page data from Chrome storage
            const pageData = await new Promise<{ title: string; url: string; content: string }>(
                (resolve, reject) => {
                    chrome.storage.local.get(["pageData"], (data) => {
                        if (!data.pageData) {
                            console.warn("❌ No page data found.");
                            alert("페이지 데이터가 없습니다.");
                            return reject("No page data available."); // Stop execution
                        }
                        resolve({
                            title: data.pageData.title || "",
                            url: data.pageData.url || "",
                            content: data.pageData.content || "",
                        });
                    });
                }
            );

            // Send data to API
            const saveResult = await ApiService.saveData(pageData);

            if (saveResult) {
                console.log("✅ Page data saved successfully!");
            } else {
                console.log("❌ Failed to save page data.");
            }
        } catch (error) {
            console.error("❌ Error in handleClick:", error);
        }
    };

    return (
        <Button 
      variant="contained" 
      onClick={handleClick} 
      fullWidth 
      style={{
        marginTop: "10px",
        color: "#fff"
      }}
    >
      테스트 케이스 저장하기!
        </Button>
    );
};

export default PageDataSendButton;
