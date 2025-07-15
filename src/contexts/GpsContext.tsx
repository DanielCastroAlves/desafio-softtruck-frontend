import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type PositionType = {
  lat: number;
  lng: number;
  vel: number;
  ang: number;
  time: number;
};

type GpsContextType = {
  position: PositionType;
  setPosition: (pos: PositionType) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  speed: number;
  setSpeed: (val: number) => void;
  selectedCourse: number;
  setSelectedCourse: (i: number) => void;
  resetSignal: number;
  reset: () => void;
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
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(80); // km/h default
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [realSpeed, setRealSpeed] = useState(0);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const reset = useCallback(() => {
    setIsPlaying(false); // Pause quando resetar
    setResetSignal((r) => r + 1);
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
        selectedCourse,
        setSelectedCourse,
        resetSignal,
        reset,
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
