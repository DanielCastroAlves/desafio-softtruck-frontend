// src/features/components/RouteMarkers/RouteMarkers.tsx
import { Marker } from "react-map-gl/mapbox";

type Props = {
  coordinates: [number, number][];
};

const RouteMarkers = ({ coordinates }: Props) => {
  return (
    <>
      {coordinates.map(([lng, lat], index) => (
        <Marker
          key={`marker-${index}`}
          longitude={lng}
          latitude={lat}
          anchor="center"
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "red",
              opacity: 0.7,
            }}
          />
        </Marker>
      ))}
    </>
  );
};

export default RouteMarkers;
