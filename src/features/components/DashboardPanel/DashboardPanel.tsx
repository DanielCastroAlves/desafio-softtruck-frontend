// DashboardPanel.tsx
import React from "react";
import { Box, Card, Tabs, Tab, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardControlsTab from "./DashboardControlsTab";
import DashboardRouteTab from "./DashboardRouteTab";
import DashboardLanguageTab from "./DashboardLanguageTab";
import styles from "./DashboardPanel.module.scss";
import type { DashboardPanelProps } from "./DashboardPanel.types";

const DashboardPanel: React.FC<DashboardPanelProps> = (props) => {
  const [tab, setTab] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  return (
    <Box className={styles.panel} data-open={open}>
      <IconButton
        onClick={() => setOpen(!open)}
        className={styles.toggleButton}
        aria-label={open ? "Fechar painel" : "Abrir painel"}
      >
        {open ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>

      {open && (
        <Card className={styles.card}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
            <Tab label="Controles" />
            <Tab label="Trocar Rota" />
            <Tab label="Idioma" />
          </Tabs>
          {tab === 0 && <DashboardControlsTab {...props} />}
          {tab === 1 && <DashboardRouteTab {...props} />}
          {tab === 2 && <DashboardLanguageTab {...props} />}
        </Card>
      )}
    </Box>
  );
};

export default DashboardPanel;
