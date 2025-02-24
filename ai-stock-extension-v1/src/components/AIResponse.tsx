import { useState } from "react";
import { Paper, Typography, CircularProgress, List, ListItem } from "@mui/material";
import GenerationRequestButton from "./GenerationRequestButton";

const AIResponse = () => {
  const [stocks, setStocks] = useState<{ stock_name: string; ticker_symbol: string; market_name: string }[] | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Paper className="popup-section" style={{ padding: "16px", textAlign: "center" }}>
      {/* AI Label & Generation Request Button in one row */}
        <Typography variant="h6" style={{ fontWeight: "bold" }}>📊 AI</Typography>
        <GenerationRequestButton setLoading={setLoading} setStocks={setStocks} /> {/* ✅ Now updates state */}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <CircularProgress size={30} />
        </div>
      ) : stocks && stocks.length > 0 ? (
        <List>
          {stocks.map((stock) => (
            <ListItem key={stock.ticker_symbol} style={{ fontSize: "14px", color: "#444" }}>
              {stock.stock_name} ({stock.ticker_symbol}) - {stock.market_name}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" style={{ color: "#777" }}>No stocks generated.</Typography>
      )}
    </Paper>
  );
};

export default AIResponse;
