// src/hooks/useRouteData.ts
import gpsData from "../data/frontend_data_gps_enriched_with_address.json";
import { lineString } from "@turf/helpers";
import type { Feature, LineString as GeoLineString } from "geojson";

// Type para ponto GPS (pode mover depois para src/types/gps.ts)
export interface GpsPoint {
  lat: number;
  lng: number;
  speed: number;
  idx: number;
  time: number;
  direction: number;
}

export function useRouteData(selectedCourse: number) {
  const gpsPoints: GpsPoint[] =
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

  const routeGeoJSON: Feature<GeoLineString> = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
    properties: {},
  };

  return {
    gpsPoints,
    coordinates,
    route,
    routeGeoJSON,
  };
}
