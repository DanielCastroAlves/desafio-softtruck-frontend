import { useTranslation } from "react-i18next";
import styles from "./HUD.module.scss";

type HUDProps = {
  speed: number;
  angle: number;
  time: number;
};

const HUD = ({ speed, angle, time }: HUDProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.hudContainer}>
      <div>{t("speed")}: {speed.toFixed(1)} km/h</div>
      <div>{t("angle")}: {angle.toFixed(1)}°</div>
      <div>{t("time")}: {Math.floor(time)}s</div>
    </div>
  );
};

export default HUD;
