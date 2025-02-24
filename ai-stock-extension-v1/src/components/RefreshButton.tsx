import { Button } from "@mui/material";
import Storage from "../services/Storage";

const RefreshButton = () => {
  const handleRefresh = () => {
    Storage.refreshData();
  };

  return (
    <Button variant="contained" onClick={handleRefresh} style={{ marginTop: "10px" }}>
      Refresh Data
    </Button>
  );
};

export default RefreshButton;
