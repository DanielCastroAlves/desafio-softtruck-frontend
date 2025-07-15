import { useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import gpsData from "../../data/frontend_data_gps.json";
import { useGps } from "../../contexts/GpsContext";
import { lineString, point as turfPoint } from "@turf/helpers";
import along from "@turf/along";
import bearing from "@turf/bearing";
import length from "@turf/length";
import Car from "../components/Car/Car";
import RouteMarkers from "../components/RouteMarkers/RouteMarkers";
import TrackSelector from "../components/TrackSelector/TrackSelector";
import LanguageSelector from "../components/LanguageSelector/LanguageSelector";
import HUD from "../components/HUD/HUD";
import Controls from "../components/Controls/Controls";
import type { Feature, LineString } from "geojson";
import { MAPBOX_TOKEN } from "../mapboxConfig";

const OFFSET = 0.0001;

const MapView = () => {
  const {
    position,
    setPosition,
    isPlaying,
    speed,
    selectedCourse,
    resetSignal,
    setRealSpeed,
  } = useGps();

  const distanceRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  const gpsPoints = gpsData.courses[selectedCourse]?.gps.map((point: any) => ({
    lat: point.latitude,
    lng: point.longitude,
  })) ?? [];

  const coordinates: [number, number][] = gpsPoints.map((point) => [point.lng, point.lat]);
  const route = lineString(coordinates);
  const totalDistance = length(route, { units: "kilometers" });

  const routeGeoJSON: Feature<LineString> = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
    properties: {},
  };

  // Ajuste: Garante posição inicial (ou após reset)
  useEffect(() => {
    distanceRef.current = 0;
    prevTimeRef.current = null;
    angleRef.current = 0;

    // Seta o carro no primeiro ponto mesmo se não estiver rodando
    if (coordinates.length > 0) {
      setPosition({
        lat: coordinates[0][1],
        lng: coordinates[0][0],
        vel: 0,
        ang: 0,
        time: Date.now(),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, resetSignal]); // resetSignal = clique no reset

  // Lógica da animação do carro
  useEffect(() => {
    if (!isPlaying) return; // só anima se está tocando/play

    const animate = (timestamp: number) => {
      if (!prevTimeRef.current) prevTimeRef.current = timestamp;
      const delta = (timestamp - prevTimeRef.current) / 1000;
      prevTimeRef.current = timestamp;

      const currentSpeedKms = speed / 3600;
      distanceRef.current += currentSpeedKms * delta;

      if (distanceRef.current > totalDistance) {
        cancelAnimationFrame(animationRef.current!);
        return;
      }

      const current = along(route, distanceRef.current, { units: "kilometers" });
      const prev = along(route, Math.max(distanceRef.current - OFFSET, 0), { units: "kilometers" });
      const next = along(route, Math.min(distanceRef.current + OFFSET, totalDistance), { units: "kilometers" });

      const rawAngle = bearing(
        turfPoint(prev.geometry.coordinates),
        turfPoint(next.geometry.coordinates)
      );
      const correctedAngle = ((rawAngle % 360) + 360) % 360;
      angleRef.current = angleRef.current * 0.8 + correctedAngle * 0.2;

      const [lng, lat] = current.geometry.coordinates;

      const closestIndex = Math.round(
        (distanceRef.current / totalDistance) * (gpsPoints.length - 1)
      );
      const realPoint = gpsData.courses[selectedCourse]?.gps[closestIndex];
      const realSpeed = realPoint?.speed ?? 0;
      setRealSpeed(realSpeed);

      setPosition({
        lat,
        lng,
        vel: speed,
        ang: angleRef.current,
        time: Date.now(),
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPlaying,
    speed,
    selectedCourse,
    setPosition,
    setRealSpeed,
    route,
    totalDistance,
    gpsPoints,
  ]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Map
        initialViewState={{
          latitude: coordinates[0]?.[1] ?? 0,
          longitude: coordinates[0]?.[0] ?? 0,
          zoom: 15,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{ "line-color": "#3b9ddd", "line-width": 4 }}
          />
        </Source>
        <Marker
          longitude={position.lng}
          latitude={position.lat}
        >
          <Car position={[position.lng, position.lat]} direction={position.ang} />
        </Marker>
        <RouteMarkers coordinates={coordinates} />
      </Map>
      <Controls />
      <TrackSelector />
      <LanguageSelector />
      <HUD />
    </div>
  );
};

export default MapView;
