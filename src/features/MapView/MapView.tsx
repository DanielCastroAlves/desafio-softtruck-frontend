import { useEffect, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import { lineString } from "@turf/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../mapboxConfig";
import gpsData from "../../data/frontend_data_gps.json";

const gpsPoints =
  gpsData.courses?.flatMap((course: any) =>
    Array.isArray(course.gps)
      ? course.gps
          .filter((p: any) => p.latitude && p.longitude)
          .map((p: any) => ({
            position: [p.longitude, p.latitude] as [number, number],
            timestamp: p.acquisition_time_unix,
          }))
      : []
  ) ?? [];

const coordinates = gpsPoints.map((point) => point.position);
const routeGeoJSON = coordinates.length >= 2 ? lineString(coordinates) : null;

const MapView = () => {
  const [viewState, setViewState] = useState({
    latitude: coordinates[0]?.[1] ?? -23.963214,
    longitude: coordinates[0]?.[0] ?? -46.28054,
    zoom: 13,
  });

  const [currentPosition, setCurrentPosition] = useState<[number, number]>(
    coordinates[0]
  );

  const speedFactor = 100;

  useEffect(() => {
    if (gpsPoints.length < 2) return;

    let currentSegmentIndex = 0;
    let animationFrameId: number;
    let animationStartTime: number | null = null;
    let segmentDuration = 1000;

    const animateVehicle = (timestamp: number) => {
      if (!animationStartTime) animationStartTime = timestamp;

      const elapsedTime = timestamp - animationStartTime;
      const progress = Math.min(elapsedTime / segmentDuration, 1);

      const { position: startPosition } = gpsPoints[currentSegmentIndex];
      const { position: endPosition } = gpsPoints[currentSegmentIndex + 1];

      const interpolatedPosition: [number, number] = [
        startPosition[0] + (endPosition[0] - startPosition[0]) * progress,
        startPosition[1] + (endPosition[1] - startPosition[1]) * progress,
      ];

      setCurrentPosition(interpolatedPosition);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateVehicle);
      } else {
        currentSegmentIndex =
          currentSegmentIndex + 1 >= gpsPoints.length - 1
            ? 0
            : currentSegmentIndex + 1;

        const timeA = gpsPoints[currentSegmentIndex].timestamp;
        const timeB = gpsPoints[currentSegmentIndex + 1].timestamp;
        const timeDifferenceMs = (timeB - timeA) * 1000;

        segmentDuration = timeDifferenceMs / speedFactor;
        animationStartTime = null;
        animationFrameId = requestAnimationFrame(animateVehicle);
      }
    };

    animationFrameId = requestAnimationFrame(animateVehicle);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Map
      {...viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {routeGeoJSON && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-layer"
            type="line"
            paint={{
              "line-color": "#ff6b6b",
              "line-width": 4,
            }}
          />
        </Source>
      )}

      {currentPosition && (
        <Marker longitude={currentPosition[0]} latitude={currentPosition[1]}>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#00ff00",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </Marker>
      )}
    </Map>
  );
};

export default MapView;
