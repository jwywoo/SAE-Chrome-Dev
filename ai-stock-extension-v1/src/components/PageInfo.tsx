import { useState } from "react";
import { Typography, Paper, IconButton, Collapse, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface PageInfoProps {
  title: string;
  url: string;
  content: string;
}

const PageInfo = ({ title, url, content }: PageInfoProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper className="popup-section">
      {/* Title with Expand Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" style={{ fontWeight: "bold" }}>{title}</Typography>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          <ExpandMoreIcon style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }} />
        </IconButton>
      </Box>

      {/* Expandable Content (Scrollable) */}
      <Collapse in={expanded}>
        <Box className="scrollable-content">
          <Typography variant="body2"><strong>URL:</strong> {url}</Typography>
          <Typography variant="body2">{content}</Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PageInfo;
