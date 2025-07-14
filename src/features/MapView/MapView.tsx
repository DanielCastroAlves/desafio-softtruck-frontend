import { useState } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import type { Feature } from "geojson";
import { lineString } from "@turf/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../mapboxConfig";

const exampleRoute: Feature = lineString([
  [-43.9378, -19.9208],
  [-43.9389, -19.9192],
  [-43.9400, -19.9180],
]);

const MapView = () => {
  const [viewState, setViewState] = useState({
    latitude: -19.9208,
    longitude: -43.9378,
    zoom: 15,
  });

  return (
    <Map
      {...viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
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
    </Map>
  );
};

export default MapView;
