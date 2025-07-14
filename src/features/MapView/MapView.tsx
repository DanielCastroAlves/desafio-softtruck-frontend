import { useState, useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import { lineString } from "@turf/helpers";
import type { Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../mapboxConfig";
import gpsData from "../../data/frontend_data_gps.json";

const MapView = () => {
  const [viewState, setViewState] = useState({
    latitude: -23.963214, // você pode centralizar com base no primeiro ponto
    longitude: -46.28054,
    zoom: 13,
  });

  // Memoize para evitar recomputação
  const exampleRoute: Feature | null = useMemo(() => {
    const coordinates =
      gpsData.courses?.flatMap((course: any) =>
        Array.isArray(course.gps)
          ? course.gps.map((point: any) => [point.longitude, point.latitude])
          : []
      ) ?? [];

    console.log("Total coordinates:", coordinates.length);
    console.log("Sample coordinates:", coordinates.slice(0, 5));

    return coordinates.length >= 2 ? lineString(coordinates) : null;
  }, []);

  return (
    <Map
      {...viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {exampleRoute && (
        <Source id="route" type="geojson" data={exampleRoute}>
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
    </Map>
  );
};

export default MapView;
