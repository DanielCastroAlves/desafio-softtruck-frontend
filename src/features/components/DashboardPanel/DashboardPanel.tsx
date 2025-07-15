import React from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  IconButton,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RefreshIcon from "@mui/icons-material/Refresh";
import LanguageIcon from "@mui/icons-material/Language";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SpeedIcon from "@mui/icons-material/Speed";

// Tipos das props
interface DashboardPanelProps {
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  speedMode: "auto" | "manual";
  setSpeedMode: (mode: "auto" | "manual") => void;
  realSpeed: number;
  onRouteChange: () => void;
  currentRoute: string;
  onLanguageChange: (lang: string) => void;
  language: string;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  playing,
  onPlayPause,
  onReset,
  speed,
  setSpeed,
  speedMode,
  setSpeedMode,
  realSpeed,
  onRouteChange,
  currentRoute,
  onLanguageChange,
  language,
}) => {
  const [tab, setTab] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  // Exibe o valor correto conforme o modo
  const shownSpeed = speedMode === "auto" ? realSpeed : speed;

  // Função para mudar o modo com log
  const handleSpeedModeChange = (mode: "auto" | "manual") => {
    setSpeedMode(mode);
    console.log("[DashboardPanel] Modo de velocidade mudou para:", mode);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: 32,
        bottom: 32,
        zIndex: 20,
        minWidth: open ? 340 : 60,
        maxWidth: open ? 400 : 60,
        transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
        borderRadius: 3,
        boxShadow: 8,
        bgcolor: open ? undefined : "rgba(34,34,40,0.8)",
        height: open ? "auto" : 60,
        display: "flex",
        alignItems: open ? "flex-start" : "center",
        justifyContent: open ? "flex-start" : "center",
      }}
    >
      {/* Botão de retração/abertura */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "absolute",
          right: open ? 8 : "auto",
          left: open ? "auto" : 8,
          top: open ? 8 : "auto",
          bottom: open ? "auto" : 8,
          zIndex: 21,
          bgcolor: "#fff",
          boxShadow: 2,
        }}
        size="medium"
        aria-label={open ? "Fechar painel" : "Abrir painel"}
      >
        {open ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>

      {open && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            minWidth: 340,
            width: "100%",
            bgcolor: "transparent",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              ".MuiTab-root": { fontWeight: 600 },
              mb: 1,
            }}
          >
            <Tab label="Controles" />
            <Tab label="Trocar Rota" />
            <Tab label="Idioma" />
          </Tabs>
          <CardContent sx={{ pb: "16px !important" }}>
            {tab === 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <IconButton onClick={onPlayPause} color="primary">
                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton onClick={onReset} color="secondary">
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Velocidade:
                  </Typography>
                  {speedMode === "manual" && (
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={shownSpeed}
                      onChange={(e) => {
                        setSpeed(Number(e.target.value));
                        handleSpeedModeChange("manual");
                      }}
                      style={{ width: 160, verticalAlign: "middle" }}
                    />
                  )}

                  <span style={{ marginLeft: 8, fontWeight: 600 }}>
                    {shownSpeed.toFixed(0)} km/h
                  </span>
                  <FormControlLabel
                    sx={{ ml: 2 }}
                    control={
                      <Switch
                        checked={speedMode === "auto"}
                        onChange={(_, checked) =>
                          handleSpeedModeChange(checked ? "auto" : "manual")
                        }
                        color="primary"
                      />
                    }
                    label={speedMode === "auto" ? "GPS (auto)" : "Manual"}
                    labelPlacement="end"
                  />
                </Box>
                {/* Exibe badge/log no modo auto para DEBUG */}
                {speedMode === "auto" && (
                  <Chip
                    icon={<SpeedIcon />}
                    label={
                      <span>
                        <b>GPS:</b> {realSpeed?.toFixed(1) || 0} km/h
                      </span>
                    }
                    sx={{
                      mt: 1,
                      background: "#232",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  />
                )}
              </Box>
            )}
            {tab === 1 && (
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
            )}
            {tab === 2 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() =>
                    onLanguageChange(language === "pt" ? "en" : "pt")
                  }
                >
                  <LanguageIcon />
                </IconButton>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {language === "pt" ? "Português" : "English"}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardPanel;
