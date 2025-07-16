import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import gpsData from "../data/frontend_data_gps_enriched_with_address.json";
import type { PositionType, StopInfo, SpeedMode } from "../types/gps";

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
  isStopped: boolean;
  stoppedAt: number | null;
  stoppedElapsed: number;
  setStoppedElapsedManual: (val: number) => void;
  runningElapsed: number;
  stopHistory: StopInfo[];
  showStopModal: boolean;
  setShowStopModal: (val: boolean) => void;
  stopDuration: number;
  skipStop: () => void;
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

  const [isStopped, setIsStopped] = useState(false);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);
  const [stoppedElapsed, setStoppedElapsed] = useState(0);
  const [runningElapsed, setRunningElapsed] = useState(0);
  const [stopHistory, setStopHistory] = useState<StopInfo[]>([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopDuration, setStopDuration] = useState(0);

  const setStoppedElapsedManual = (val: number) => setStoppedElapsed(val);

  useEffect(() => {
let interval: number | null = null;

    if (isStopped && showStopModal) {
      interval = setInterval(() => setStoppedElapsed(prev => prev + 1), 1000);
    } else if (isPlaying && !isStopped) {
      interval = setInterval(() => setRunningElapsed(prev => prev + 1), 1000);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, isStopped, showStopModal]);

  useEffect(() => {
    if (position.vel === 0) {
      if (!isStopped) {
        setIsStopped(true);
        setStoppedAt(position.time);
        setStoppedElapsed(0);
      }
      if (position.idx !== undefined) {
        const points = gpsData.courses[selectedCourse]?.gps ?? [];
        let idx = position.idx;
        let nextMoveIdx = idx;
        while (nextMoveIdx < points.length && points[nextMoveIdx]?.speed === 0) {
          nextMoveIdx++;
        }
        if (
          nextMoveIdx > idx + 1 &&
          !showStopModal &&
          points[nextMoveIdx]
        ) {
          const waitSeconds =
            points[nextMoveIdx].acquisition_time_unix - points[idx].acquisition_time_unix;
          if (waitSeconds >= 60) {
            setShowStopModal(true);
            setStopDuration(waitSeconds);
          }
        }
      }
    } else {
      if (isStopped && stoppedAt !== null) {
        setIsStopped(false);
        setStopHistory(history => [
          ...history,
          {
            startedAt: stoppedAt,
            endedAt: position.time,
            duration: position.time - stoppedAt,
            lat: position.lat,
            lng: position.lng,
          },
        ]);
        setStoppedAt(null);
        setStoppedElapsed(0);
        setShowStopModal(false);
      }
    }
  }, [position.vel, position.time, position.idx, isStopped, stoppedAt, selectedCourse, showStopModal]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setResetSignal(r => r + 1);
    setIsStopped(false);
    setStoppedAt(null);
    setStoppedElapsed(0);
    setRunningElapsed(0);
    setStopHistory([]);
    setShowStopModal(false);
    setStopDuration(0);
  }, []);

  const skipStop = useCallback(() => {
    const points = gpsData.courses[selectedCourse]?.gps ?? [];
    if (position.idx !== undefined) {
      let idx = position.idx;
      let nextMoveIdx = idx;
      while (nextMoveIdx < points.length && points[nextMoveIdx]?.speed === 0) {
        nextMoveIdx++;
      }
      if (points[nextMoveIdx]) {
        setPosition({
          lat: points[nextMoveIdx].latitude,
          lng: points[nextMoveIdx].longitude,
          vel: points[nextMoveIdx].speed,
          ang: points[nextMoveIdx].direction,
          time: points[nextMoveIdx].acquisition_time_unix,
          idx: nextMoveIdx,
        });
        setShowStopModal(false);
        setStoppedElapsed(0);
      }
    }
  }, [selectedCourse, position.idx, setPosition]);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
  const customSetSpeedMode = (mode: SpeedMode) => setSpeedMode(mode);

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
        setSpeedMode: customSetSpeedMode,
        selectedCourse,
        setSelectedCourse,
        resetSignal,
        reset,
        realSpeed,
        setRealSpeed,
        isStopped,
        stoppedAt,
        stoppedElapsed,
        setStoppedElapsedManual,
        runningElapsed,
        stopHistory,
        showStopModal,
        setShowStopModal,
        stopDuration,
        skipStop,
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
