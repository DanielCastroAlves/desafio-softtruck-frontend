import MapView from "./features/MapView/MapView";
import { GpsProvider } from "./contexts/GpsContext";

function App() {
  return (
    <GpsProvider>
      <MapView />
    </GpsProvider>
  );
}

export default App;
