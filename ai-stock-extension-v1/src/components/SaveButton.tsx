import { Button } from "@mui/material";
import ApiService from "../services/ApiService";

const SaveButton = ({ stock }: { stock: { stock_name: string; ticker_symbol: string; market_name: string } }) => {
  return (
    <Button 
      variant="contained" 
      color="secondary" 
      size="small" 
      onClick={() => ApiService.saveStock(stock)}
    >
      Save
    </Button>
  );
};

export default SaveButton;
