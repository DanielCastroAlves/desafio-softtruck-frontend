// src/contexts/GpsContext.tsx
import { createContext, useContext, useState } from "react";

type GpsContextType = {
  selectedCourse: number;
  setSelectedCourse: (index: number) => void;
  reset: () => void;
};

const GpsContext = createContext<GpsContextType | undefined>(undefined);

export const GpsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const reset = () => setResetKey((k) => k + 1);

  return (
    <GpsContext.Provider value={{ selectedCourse, setSelectedCourse, reset }}>
      <div key={resetKey}>{children}</div>
    </GpsContext.Provider>
  );
};

export const useGps = () => {
  const ctx = useContext(GpsContext);
  if (!ctx) throw new Error("useGps must be used within GpsProvider");
  return ctx;
};
