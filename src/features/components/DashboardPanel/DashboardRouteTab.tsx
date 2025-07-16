import React from "react";
import { Box, Button } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import type { DashboardPanelProps } from "./DashboardPanel.types";

const DashboardRouteTab: React.FC<DashboardPanelProps> = ({
  onRouteChange,
  currentRoute,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Button
      startIcon={<SwapHorizIcon />}
      onClick={onRouteChange}
      variant="contained"
      sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
    >
      Trocar Rota {currentRoute}
    </Button>
  </Box>
);

export default DashboardRouteTab;
