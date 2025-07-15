import { Marker } from "react-map-gl/mapbox";
import sprite from "../../../assets/cars.png";
import styles from "./Car.module.scss";

type CarProps = {
  position: [number, number];
  direction: number;
};

const Car = ({ position, direction }: CarProps) => {
  const totalFrames = 120;
  const frameWidth = 40;
  const frameHeight = 40;

  const adjustedAngle = (direction + 30) % 360;
  const frameIndex = Math.round(adjustedAngle / (360 / totalFrames)) % totalFrames;

  return (
    <Marker longitude={position[0]} latitude={position[1]} anchor="center">
      <div
        className={styles.car}
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${sprite})`,
          backgroundPosition: `-${frameIndex * frameWidth}px 0px`,
          backgroundSize: `${frameWidth * totalFrames}px ${frameHeight}px`,
        }}
      />
    </Marker>
  );
};

export default Car;
