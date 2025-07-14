import {  useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import { lineString } from "@turf/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../mapboxConfig";
import gpsData from "../../data/frontend_data_gps.json";

// Transforma os dados GPS em coordenadas válidas
const coordinates =
  gpsData.courses?.flatMap((course: any) =>
    Array.isArray(course.gps)
      ? course.gps
          .filter((point: any) => point.latitude && point.longitude)
          .map((point: any) => [point.longitude, point.latitude])
      : []
  ) ?? [];

// Cria a linha (rota)
const routeGeoJSON = coordinates.length >= 2 ? lineString(coordinates) : null;

const MapView = () => {
  const [viewState, setViewState] = useState({
    latitude: -23.963214,
    longitude: -46.28054,
    zoom: 13,
  });

  return (
    <Map
      {...viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Rota */}
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

      {/* Marcadores de pontos GPS */}
      {coordinates.map(([lon, lat], index) => (
        <Marker key={index} longitude={lon} latitude={lat}>
          <div
            style={{
              width: 6,
              height: 6,
              background: "#1976d2",
              borderRadius: "50%",
            }}
          />
        </Marker>
      ))}
    </Map>
  );
};

export default MapView;
