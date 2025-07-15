import gpsData from "../../../data/frontend_data_gps.json";
import { useGps } from "../../../contexts/GpsContext";
import { useTranslation } from "react-i18next";
import styles from "./TrackSelector.module.scss";

const TrackSelector = () => {
  const { selectedCourse, setSelectedCourse, reset } = useGps();
  const { t } = useTranslation();

  const totalCourses = gpsData.courses.length;

  const handleChange = () => {
    const next = (selectedCourse + 1) % totalCourses;
    setSelectedCourse(next);
    reset();
  };

  return (
    <button className={styles.button} onClick={handleChange}>
      {t("changeRoute")} ({selectedCourse + 1}/{totalCourses})
    </button>
  );
};

export default TrackSelector;
