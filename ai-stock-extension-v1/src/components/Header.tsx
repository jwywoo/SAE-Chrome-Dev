import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Storage from "../services/Storage"

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0} style={{ borderRadius: "8px" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#fff" }}>
          온세주
        </Typography>
        <Button variant="contained" color="secondary" size="small" onClick={Storage.refreshData}>
          Refresh
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
