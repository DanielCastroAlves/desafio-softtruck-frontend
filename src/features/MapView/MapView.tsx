// src/features/MapView/MapView.tsx
import { useEffect, useRef, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import gpsData from "../../data/frontend_data_gps_enriched_with_address.json";
import { useGps } from "../../contexts/GpsContext";
import { lineString, point as turfPoint } from "@turf/helpers";
import along from "@turf/along";
import bearing from "@turf/bearing";
import length from "@turf/length";
import Car from "../components/Car/Car";
import RouteMarkers from "../components/RouteMarkers/RouteMarkers";
import type { Feature, LineString } from "geojson";
import DashboardPanel from "../components/DashboardPanel/DashboardPanel";
import { useTranslation } from "react-i18next";
import HUD from "../components/HUD/HUD";
import ModalStop from "../components/ModalStop/ModalStop";

const OFFSET = 0.0001;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

const MapView = () => {
  const {
    position,
    setPosition,
    isPlaying,
    togglePlay,
    reset,
    speed,
    setSpeed,
    speedMode,
    setSpeedMode,
    realSpeed,
    selectedCourse,
    setSelectedCourse,
    resetSignal,
    setRealSpeed,
    showStopModal,
    setShowStopModal,
    stopDuration,
    stoppedElapsed,
    setStoppedElapsedManual,
  } = useGps();

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [paradoDesde, setParadoDesde] = useState<number | null>(null);
  const [rodandoDesde, setRodandoDesde] = useState<number | null>(null);

  function handleTrocarRota() {
    setSelectedCourse((prev) => (prev + 1) % gpsData.courses.length);
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
  }

  const distanceRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  const gpsPoints =
    gpsData.courses[selectedCourse]?.gps.map((point: any, idx: number) => ({
      lat: point.latitude,
      lng: point.longitude,
      speed: point.speed,
      idx,
      time: point.acquisition_time_unix,
      direction: point.direction,
    })) ?? [];

  const coordinates: [number, number][] = gpsPoints.map((p) => [p.lng, p.lat]);
  const route = lineString(coordinates);
  const totalDistance = length(route, { units: "kilometers" });

  const routeGeoJSON: Feature<LineString> = {
    type: "Feature",
    geometry: { type: "LineString", coordinates },
    properties: {},
  };

  useEffect(() => {
    distanceRef.current = 0;
    prevTimeRef.current = null;
    angleRef.current = 0;
    setParadoDesde(null);
    setRodandoDesde(Date.now());
    if (coordinates.length > 0) {
      setPosition({
        lat: coordinates[0][1],
        lng: coordinates[0][0],
        vel: 0,
        ang: 0,
        time: Date.now(),
        idx: 0,
      });
    }
  }, [selectedCourse, resetSignal]);

  useEffect(() => {
    if (!isPlaying) return;

    let pulandoParada = false;

    const animate = (timestamp: number) => {
      if (!prevTimeRef.current) prevTimeRef.current = timestamp;
      const delta = (timestamp - prevTimeRef.current) / 1000;
      prevTimeRef.current = timestamp;

      let closestIndex = Math.round(
        (distanceRef.current / totalDistance) * (gpsPoints.length - 1)
      );
      closestIndex = Math.max(0, Math.min(closestIndex, gpsPoints.length - 1));
      let realPoint = gpsPoints[closestIndex];
      let realSpeedNow = realPoint?.speed ?? 0;

      setRealSpeed(realSpeedNow);

      const isStopped = realSpeedNow === 0;
      if (isStopped) {
        if (paradoDesde == null) setParadoDesde(Date.now());
        if (rodandoDesde != null) setRodandoDesde(null);
      } else {
        if (rodandoDesde == null) setRodandoDesde(Date.now());
        if (paradoDesde != null) setParadoDesde(null);
      }

      if (isStopped && !showStopModal && !pulandoParada) {
        let idx = closestIndex;
        while (idx < gpsPoints.length && gpsPoints[idx]?.speed === 0) idx++;
        let waitSeconds = 0;
        if (idx < gpsPoints.length) {
          waitSeconds = gpsPoints[idx].time - gpsPoints[closestIndex].time;
        }
        if (waitSeconds >= 10) {
          setShowStopModal(true);
          return;
        }
      }

      if (showStopModal && !pulandoParada) return;

      const currentSpeedKms =
        speedMode === "auto" ? realSpeedNow / 3600 : speed / 3600;
      distanceRef.current += currentSpeedKms * delta;

      if (distanceRef.current > totalDistance) {
        cancelAnimationFrame(animationRef.current!);
        return;
      }

      const current = along(route, distanceRef.current, {
        units: "kilometers",
      });
      const prev = along(route, Math.max(distanceRef.current - OFFSET, 0), {
        units: "kilometers",
      });
      const next = along(
        route,
        Math.min(distanceRef.current + OFFSET, totalDistance),
        { units: "kilometers" }
      );

      const rawAngle = bearing(
        turfPoint(prev.geometry.coordinates),
        turfPoint(next.geometry.coordinates)
      );
      const correctedAngle = ((rawAngle % 360) + 360) % 360;
      angleRef.current = angleRef.current * 0.8 + correctedAngle * 0.2;

      const [lng, lat] = current.geometry.coordinates;

      setPosition({
        lat,
        lng,
        vel: speedMode === "auto" ? realSpeedNow : speed,
        ang: angleRef.current,
        time: Date.now(),
        idx: closestIndex,
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    isPlaying,
    speed,
    speedMode,
    selectedCourse,
    setPosition,
    setRealSpeed,
    route,
    totalDistance,
    gpsPoints,
    showStopModal,
    paradoDesde,
    rodandoDesde,
  ]);

  function handleSkipStop() {
    let closestIndex = position.idx ?? 0;
    let idx = closestIndex;
    while (idx < gpsPoints.length && gpsPoints[idx]?.speed === 0) idx++;
    if (idx < gpsPoints.length) {
      const p = gpsPoints[idx];
      distanceRef.current = (idx / (gpsPoints.length - 1)) * totalDistance;
      setPosition({
        lat: p.lat,
        lng: p.lng,
        vel: p.speed,
        ang: p.direction,
        time: Date.now(),
        idx,
      });
      setShowStopModal(false);
      setParadoDesde(null);
      setRodandoDesde(Date.now());
    }
  }

  const tempoParado = paradoDesde
    ? Math.floor((Date.now() - paradoDesde) / 1000)
    : 0;
  const tempoRodando = rodandoDesde
    ? Math.floor((Date.now() - rodandoDesde) / 1000)
    : 0;

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
      >
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{ "line-color": "#3b9ddd", "line-width": 4 }}
          />
        </Source>
        <Marker longitude={position.lng} latitude={position.lat}>
          <Car
            position={[position.lng, position.lat]}
            direction={position.ang}
          />
        </Marker>
        <RouteMarkers coordinates={coordinates} />
      </Map>
      <DashboardPanel
        playing={isPlaying}
        onPlayPause={togglePlay}
        onReset={reset}
        speed={speed}
        setSpeed={setSpeed}
        speedMode={speedMode}
        setSpeedMode={setSpeedMode}
        realSpeed={realSpeed}
        onRouteChange={handleTrocarRota}
        currentRoute={`(${selectedCourse + 1}/${gpsData.courses.length})`}
        onLanguageChange={changeLanguage}
        language={currentLanguage}
      />
      <HUD tempoParado={tempoParado} tempoRodando={tempoRodando} />
      <ModalStop
        open={showStopModal}
        onSkip={handleSkipStop}
        tempoParado={stoppedElapsed}
        tempoTotalParada={stopDuration}
        onFastForward={setStoppedElapsedManual}
      />
    </div>
  );
};

export default MapView;
