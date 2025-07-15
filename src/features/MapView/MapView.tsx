import { useEffect, useRef, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_TOKEN } from "../mapboxConfig";
import gpsData from "../../data/frontend_data_gps.json";
import Car from "../components/Car";
import HUD from "../components/HUD/HUD";
import TrackSelector from "../components/TrackSelector/TrackSelector";
import { useGps } from "../../contexts/GpsContext";

import { lineString, point as turfPoint } from "@turf/helpers";
import along from "@turf/along";
import bearing from "@turf/bearing";
import length from "@turf/length";
import type { Feature, LineString } from "geojson";

const OFFSET = 0.0001;
const speed = 80;

const MapView = () => {
  const { selectedCourse } = useGps();
  const gpsPoints = gpsData.courses?.[selectedCourse]?.gps ?? [];
  const coordinates = gpsPoints.map((p: any) => [p.longitude, p.latitude]);

  const route = lineString(coordinates);
  const totalDistance = length(route, { units: "kilometers" });

  const [viewState, setViewState] = useState({
    latitude: coordinates[0]?.[1] ?? 0,
    longitude: coordinates[0]?.[0] ?? 0,
    zoom: 15,
  });

  const [currentPos, setCurrentPos] = useState<[number, number]>(
    (coordinates[0] ?? [0, 0]) as [number, number]
  );
  const [angle, setAngle] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const distanceRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  const routeGeoJSON: Feature<LineString> = {
    type: "Feature",
    geometry: route.geometry,
    properties: {},
  };

  useEffect(() => {
    distanceRef.current = 0;
    prevTimeRef.current = null;
    setElapsedTime(0);

    const animate = (timestamp: number) => {
      if (!prevTimeRef.current) prevTimeRef.current = timestamp;
      const delta = (timestamp - prevTimeRef.current) / 1000;
      prevTimeRef.current = timestamp;

      setElapsedTime((prev) => prev + delta);

      const speedKms = speed / 3600;
      distanceRef.current += speedKms * delta;
      setCurrentSpeed(speedKms * 3600);

      if (distanceRef.current > totalDistance) {
        cancelAnimationFrame(animationRef.current!);
        return;
      }

      const current = along(route, distanceRef.current, { units: "kilometers" });
      const prev = along(route, Math.max(distanceRef.current - OFFSET, 0), {
        units: "kilometers",
      });
      const next = along(route, Math.min(distanceRef.current + OFFSET, totalDistance), {
        units: "kilometers",
      });

      const rawAngle = bearing(
        turfPoint(prev.geometry.coordinates),
        turfPoint(next.geometry.coordinates)
      );

      const spriteAngle = (rawAngle + 360) % 360;
      const deltaAngle = ((spriteAngle - angleRef.current + 540) % 360) - 180;
      const smoothAngle = (angleRef.current + deltaAngle * 0.2 + 360) % 360;

      angleRef.current = smoothAngle;

      setCurrentPos(current.geometry.coordinates as [number, number]);
      setAngle(smoothAngle);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedCourse]);

  return (
    <>
      <TrackSelector />
      <Map
        {...viewState}
        onMove={(e: ViewStateChangeEvent) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{ "line-color": "#3b9ddd", "line-width": 4 }}
          />
        </Source>

        <Car position={currentPos} direction={angle} />
      </Map>

      <HUD speed={currentSpeed} angle={angle} time={elapsedTime} />
    </>
  );
};

export default MapView;
