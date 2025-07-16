import React from "react";
import {
  IconButton,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Chip
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpeedIcon from "@mui/icons-material/Speed";
import type { DashboardPanelProps } from "./DashboardPanel.types";

const DashboardControlsTab: React.FC<DashboardPanelProps> = ({
  playing,
  onPlayPause,
  onReset,
  speed,
  setSpeed,
  speedMode,
  setSpeedMode,
  realSpeed,
}) => {
  // Exibe o valor correto conforme o modo
  const shownSpeed = speedMode === "auto" ? realSpeed : speed;

  // Função para mudar o modo
  const handleSpeedModeChange = (mode: "auto" | "manual") => {
    setSpeedMode(mode);
  };

  return (
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
      {/* Exibe badge/log no modo auto */}
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
  );
};

export default DashboardControlsTab;
