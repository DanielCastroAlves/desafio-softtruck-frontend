import { useTranslation } from "react-i18next";
import { useGps } from "../../../contexts/GpsContext";

const HUD = () => {
  const { position } = useGps();
  const { t: translate } = useTranslation();

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "16px",
        fontFamily: "monospace",
        zIndex: 1000,
      }}
    >
      <div>{translate("speed")}: {position.vel.toFixed(1)} km/h</div>
      <div>{translate("angle")}: {position.ang.toFixed(1)}°</div>
      <div>{translate("lat")}: {position.lat.toFixed(5)}</div>
      <div>{translate("lng")}: {position.lng.toFixed(5)}</div>
    </div>
  );
};

export default HUD;
