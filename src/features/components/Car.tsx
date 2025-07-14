import { Marker } from "react-map-gl/mapbox";
import sprite from "../../assets/cars.png";

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
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${sprite})`,
          backgroundPosition: `-${frameIndex * frameWidth}px 0px`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${frameWidth * totalFrames}px ${frameHeight}px`,
          imageRendering: "pixelated",
          transform: "scaleX(-1)",
          transformOrigin: "center center",
        }}
      />
    </Marker>
  );
};

export default Car;
