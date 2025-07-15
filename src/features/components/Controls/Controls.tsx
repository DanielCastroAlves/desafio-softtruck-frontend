import React from "react";
import { useTranslation } from "react-i18next";
import { useGps } from "../../../contexts/GpsContext";

const Controls: React.FC = () => {
  const { isPlaying, togglePlay, reset, speed, setSpeed } = useGps();
  const { t } = useTranslation();

  return (
    <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(0,0,0,0.6)", color: "#fff", padding: 12, borderRadius: 8, zIndex: 100 }}>
      <button onClick={togglePlay}>
        {isPlaying ? `⏸️ ${t("pause")}` : `▶️ ${t("play")}`}
      </button>{" "}
      <button onClick={reset}>🔁 {t("reset")}</button>{" "}
      <label>
        🐢/🐇 {t("speed")}:{" "}
        <input type="range" min={10} max={200} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        {speed} km/h
      </label>
    </div>
  );
};

export default Controls;
