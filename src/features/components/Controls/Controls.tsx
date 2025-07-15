import React from "react";
import { useTranslation } from "react-i18next";
import { useGps } from "../../../contexts/GpsContext";

const Controls: React.FC = () => {
  const { isPlaying, togglePlay, reset, speed, setSpeed } = useGps();
  const { t } = useTranslation();

  return (
    <div style={{
      // background: "rgba(0,0,0,0.6)",
      // color: "#fff",
      // padding: 12,
      // borderRadius: 8,
      // display: "flex",
      // gap: 12,
      // alignItems: "center"
    }}>
      <button onClick={togglePlay}>
        {isPlaying ? `⏸️ ${t("pause")}` : `▶️ ${t("play")}`}
      </button>
      <button onClick={reset}>🔁 {t("reset")}</button>
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        🐢/🐇 {t("speed")}:
        <input
          type="range"
          min={10}
          max={200}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{ margin: "0 8px" }}
        />
        {speed} km/h
      </label>
    </div>
  );
};

export default Controls;
