export type SpeedMode = "auto" | "manual";

export type PositionType = {
  lat: number;
  lng: number;
  vel: number;
  ang: number;
  time: number;
  idx?: number;
};

export type StopInfo = {
  startedAt: number;
  endedAt: number;
  duration: number;
  lat: number;
  lng: number;
};
