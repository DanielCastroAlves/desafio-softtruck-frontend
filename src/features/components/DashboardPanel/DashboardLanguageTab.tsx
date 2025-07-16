import React from "react";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { Box, Typography } from "@mui/material";

const DashboardLanguageTab: React.FC = () => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
      Idioma do sistema
    </Typography>
    <LanguageSelector />
  </Box>
);

export default DashboardLanguageTab;
