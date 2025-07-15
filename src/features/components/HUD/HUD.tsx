import { useTranslation } from "react-i18next";

type HUDProps = {
  speed: number;
  angle: number;
  time: number;
};

const HUD = ({ speed, angle, time }: HUDProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "10px 16px",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontSize: "14px",
        lineHeight: "1.5",
        zIndex: 10,
        minWidth: "120px"
      }}
    >
      <div>{t("speed")}: {speed.toFixed(1)} km/h</div>
      <div>{t("angle")}: {angle.toFixed(1)}°</div>
      <div>{t("time")}: {Math.floor(time)}s</div>
    </div>
  );
};

export default HUD;
