import { GpsProvider } from "./contexts/GpsContext";
import MapView from "./features/MapView/MapView";

const App: React.FC = () => (
  <GpsProvider>
    <MapView />
  </GpsProvider>
);

export default App;
