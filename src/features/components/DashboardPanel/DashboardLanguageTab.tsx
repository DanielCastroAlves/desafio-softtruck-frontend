import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import type { DashboardPanelProps } from "./DashboardPanel.types";

const DashboardLanguageTab: React.FC<DashboardPanelProps> = ({
  onLanguageChange,
  language,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <IconButton
      onClick={() => onLanguageChange(language === "pt" ? "en" : "pt")}
    >
      <LanguageIcon />
    </IconButton>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {language === "pt" ? "Português" : "English"}
    </Typography>
  </Box>
);

export default DashboardLanguageTab;
