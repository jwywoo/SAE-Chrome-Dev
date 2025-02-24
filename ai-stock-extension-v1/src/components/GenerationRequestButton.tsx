import { useState } from "react";
import { Button } from "@mui/material";
import Generation from "../services/Generation";

const GenerationRequestButton = ({ setLoading, setStocks }: { setLoading: (loading: boolean) => void, setStocks: (stocks: any) => void }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    setIsClicked(true); // Change button color
    setLoading(true); // Start loading animation inside result box

    const aiResponse = await Generation.getRelatedStocks();
    
    if (aiResponse?.generated_stocks) {
      setStocks(aiResponse.generated_stocks);
    } else {
      setStocks(null);
    }

    setLoading(false); // Stop loading animation after response

    setTimeout(() => setIsClicked(false), 3000); // Reset color after 3 seconds
  };

  return (
    <Button 
      variant="contained" 
      onClick={handleClick} 
      fullWidth 
      style={{
        marginTop: "10px",
        backgroundColor: isClicked ? "#ff9800" : "#1976d2", // Changes color when clicked
        color: "#fff"
      }}
    >
      온 세상이 주식이야!
    </Button>
  );
};

export default GenerationRequestButton;
