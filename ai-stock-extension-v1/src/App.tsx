import { useState, useEffect } from "react";
import { Container, Divider, Box } from "@mui/material";
import Header from "./components/Header";
import PageInfo from "./components/PageInfo";
import AIResponse from "./components/AIResponse";
import Storage from "./services/Storage";
import "./styles/popup.css";

function App() {
  const [pageData, setPageData] = useState({ title: "Loading...", url: "Loading...", content: "" });

  useEffect(() => {
    console.log("✅ Popup opened. Fetching page data...");
    Storage.getPageData().then(setPageData);
  }, []);

  return (
    <Container className="popup-container" maxWidth={false} disableGutters>
      <Header />
      <Divider style={{ margin: "10px 0" }} />
      <Box className="popup-content">
        <PageInfo title={pageData.title} url={pageData.url} content={pageData.content} />
        <AIResponse />
      </Box>
    </Container>
  );
}

export default App;
