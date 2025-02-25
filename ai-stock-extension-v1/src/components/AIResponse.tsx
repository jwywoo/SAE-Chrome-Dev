import { useState } from "react";
import { Paper, Typography, CircularProgress, List, ListItem, Grid } from "@mui/material";
import GenerationRequestButton from "./GenerationRequestButton";
import SaveButton from "./SaveButton"; // ✅ Import SaveButton

const AIResponse = () => {
  const [stocks, setStocks] = useState<{ stock_name: string; ticker_symbol: string; market_name: string }[] | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Paper className="popup-section" style={{ padding: "16px", textAlign: "center" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6" style={{ fontWeight: "bold" }}>📊 AI</Typography>
        <GenerationRequestButton setLoading={setLoading} setStocks={setStocks} />
      </Grid>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <CircularProgress size={30} />
        </div>
      ) : stocks && stocks.length > 0 ? (
        <List>
          {stocks.map((stock) => (
            <ListItem key={stock.ticker_symbol} style={{ fontSize: "14px", color: "#444", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{stock.stock_name} ({stock.ticker_symbol}) - {stock.market_name}</span>
              <SaveButton stock={stock} /> {/* ✅ Save Button Added */}
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
