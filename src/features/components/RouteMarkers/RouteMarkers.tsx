import React from "react";
import { Marker } from "react-map-gl/mapbox";
import styles from "./RouteMarkers.module.scss";

type RouteMarkersProps = {
  coordinates: [number, number][];
};

const RouteMarkers: React.FC<RouteMarkersProps> = ({ coordinates }) => (
  <>
    {coordinates.map(([longitude, latitude], index) => (
      <Marker
        key={`marker-${index}`}
        longitude={longitude}
        latitude={latitude}
        anchor="center"
      >
        <div className={styles.marker} />
      </Marker>
    ))}
  </>
);

export default RouteMarkers;
