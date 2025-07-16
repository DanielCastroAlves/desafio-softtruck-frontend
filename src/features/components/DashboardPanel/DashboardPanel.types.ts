export interface DashboardPanelProps {
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  speedMode: "auto" | "manual";
  setSpeedMode: (mode: "auto" | "manual") => void;
  realSpeed: number;
  onRouteChange: () => void;
  currentRoute: string;
  onLanguageChange: (lang: string) => void;
  language: string;
}
