import { Marker } from "react-map-gl/mapbox";
import spriteSheet from "../../../assets/cars.png";
import styles from "./Car.module.scss";

type CarProps = {
  position: [number, number];
  direction: number;
};

const CAR_FRAME_WIDTH = 40;
const CAR_FRAME_HEIGHT = 40;
const CAR_TOTAL_FRAMES = 120;
const ANGLE_OFFSET = 30;

const Car = ({ position, direction }: CarProps) => {
  const adjustedAngle = (direction + ANGLE_OFFSET) % 360;
  const frameIndex =
    Math.round(adjustedAngle / (360 / CAR_TOTAL_FRAMES)) % CAR_TOTAL_FRAMES;

  return (
    <Marker longitude={position[0]} latitude={position[1]} anchor="center">
      <div
        className={styles.car}
        style={{
          width: `${CAR_FRAME_WIDTH}px`,
          height: `${CAR_FRAME_HEIGHT}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `-${frameIndex * CAR_FRAME_WIDTH}px 0px`,
          backgroundSize: `${
            CAR_FRAME_WIDTH * CAR_TOTAL_FRAMES
          }px ${CAR_FRAME_HEIGHT}px`,
        }}
      />
    </Marker>
  );
};

export default Car;
