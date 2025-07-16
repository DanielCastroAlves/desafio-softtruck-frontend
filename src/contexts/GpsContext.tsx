// src/contexts/GpsContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { PositionType, SpeedMode } from "../types/gps";

// Tipagem enxuta
type GpsContextType = {
  position: PositionType;
  setPosition: (pos: PositionType) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  speed: number;
  setSpeed: (val: number) => void;
  speedMode: SpeedMode;
  setSpeedMode: (mode: SpeedMode) => void;
  selectedCourse: number;
  setSelectedCourse: React.Dispatch<React.SetStateAction<number>>;
  resetSignal: number;
  reset: () => void;
  realSpeed: number;
  setRealSpeed: (val: number) => void;
};

const GpsContext = createContext<GpsContextType | undefined>(undefined);

export const GpsProvider = ({ children }: { children: ReactNode }) => {
  const [position, setPosition] = useState<PositionType>({
    lat: 0,
    lng: 0,
    vel: 0,
    ang: 0,
    time: 0,
    idx: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(80);
  const [speedMode, setSpeedMode] = useState<SpeedMode>("auto");
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [realSpeed, setRealSpeed] = useState(0);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setResetSignal(r => r + 1);
  }, []);

  return (
    <GpsContext.Provider
      value={{
        position,
        setPosition,
        isPlaying,
        togglePlay,
        speed,
        setSpeed,
        speedMode,
        setSpeedMode,
        selectedCourse,
        setSelectedCourse,
        resetSignal,
        reset,
        realSpeed,
        setRealSpeed,
      }}
    >
      {children}
    </GpsContext.Provider>
  );
};

export const useGps = () => {
  const ctx = useContext(GpsContext);
  if (!ctx) throw new Error("useGps must be used within GpsProvider");
  return ctx;
};
