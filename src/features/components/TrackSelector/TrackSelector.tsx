import { useGps } from "../../../contexts/GpsContext";
import gpsData from "../../../data/frontend_data_gps.json";

const TrackSelector = () => {
  const { selectedCourse, setSelectedCourse, reset } = useGps();

  const totalCourses = gpsData.courses.length;

  const handleChange = () => {
    const next = (selectedCourse + 1) % totalCourses;
    setSelectedCourse(next);
    reset();
  };

  return (
    <button
      onClick={handleChange}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        padding: "10px 16px",
        fontSize: "16px",
        backgroundColor: "#3b9ddd",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      Trocar Rota ({selectedCourse + 1}/{totalCourses})
    </button>
  );
};

export default TrackSelector;
