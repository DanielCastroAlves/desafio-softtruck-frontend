import React from "react";

import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell } from "recharts";

import { useGps } from "../../../contexts/GpsContext";

import gpsData from "../../../data/frontend_data_gps_enriched_with_address.json";

import styles from "./HUD.module.scss";

const MAX_SPEED_KMH = 200;
const CHART_SEGMENTS = [
  { name: "Baixa", value: MAX_SPEED_KMH * 0.4, color: "#4caf50" },
  { name: "Média", value: MAX_SPEED_KMH * 0.4, color: "#ffc107" },
  { name: "Alta", value: MAX_SPEED_KMH * 0.2, color: "#f44336" },
];
const NEEDLE_RADIUS = 8;
const CHART_CENTER_X = 100;
const CHART_CENTER_Y = 110;
const CHART_INNER_RADIUS = 58;
const CHART_OUTER_RADIUS = 95;

type NeedleProps = {
  value: number;
  data: { value: number }[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
};

function renderNeedle({
  value,
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  color,
}: NeedleProps) {
  const RADIAN = Math.PI / 180;
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const angle = 180 * (1 - value / total);
  const length = (innerRadius + 2 * outerRadius) / 3;
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);

  const xBaseA = centerX + NEEDLE_RADIUS * sin;
  const yBaseA = centerY - NEEDLE_RADIUS * cos;
  const xBaseB = centerX - NEEDLE_RADIUS * sin;
  const yBaseB = centerY + NEEDLE_RADIUS * cos;
  const xTip = centerX + length * cos;
  const yTip = centerY + length * sin;

  return [
    <circle
      key="needle-circle"
      cx={centerX}
      cy={centerY}
      r={NEEDLE_RADIUS}
      fill={color}
    />,
    <path
      key="needle-path"
      d={`M${xBaseA} ${yBaseA}L${xBaseB} ${yBaseB} L${xTip} ${yTip} L${xBaseA} ${yBaseA}`}
      fill={color}
    />,
  ];
}

const HUD: React.FC = () => {
  const { t } = useTranslation();
  const { position, selectedCourse } = useGps();

  const points = gpsData.courses[selectedCourse]?.gps ?? [];
  const closestIdx =
    points.length > 0
      ? points.reduce(
          (acc, point, idx) => {
            const dist =
              Math.abs(point.latitude - position.lat) +
              Math.abs(point.longitude - position.lng);
            return dist < acc.dist ? { dist, idx } : acc;
          },
          { dist: Infinity, idx: 0 }
        ).idx
      : 0;

  const currentPoint = points[closestIdx] || {};
  const currentSpeed = Math.max(0, Math.min(position.vel, MAX_SPEED_KMH));

  return (
    <div className={styles.hudContainer}>
      <PieChart width={200} height={130}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={CHART_SEGMENTS}
          cx={CHART_CENTER_X}
          cy={CHART_CENTER_Y}
          innerRadius={CHART_INNER_RADIUS}
          outerRadius={CHART_OUTER_RADIUS}
          stroke="none"
        >
          {CHART_SEGMENTS.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        {renderNeedle({
          value: currentSpeed,
          data: CHART_SEGMENTS,
          centerX: CHART_CENTER_X,
          centerY: CHART_CENTER_Y,
          innerRadius: CHART_INNER_RADIUS,
          outerRadius: CHART_OUTER_RADIUS,
          color: "#f9e025",
        })}
        <text
          x={CHART_CENTER_X}
          y={CHART_CENTER_Y + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: "#fff",
            fontSize: "26px",
            fontWeight: "bold",
            textShadow: "0 1px 6px #000a",
          }}
        >
          {currentSpeed.toFixed(0)}
        </text>
        <text
          x={CHART_CENTER_X}
          y={CHART_CENTER_Y + 38}
          textAnchor="middle"
          style={{
            fill: "#aad",
            fontSize: "15px",
            fontWeight: 600,
            textShadow: "0 1px 4px #000a",
          }}
        >
          km/h
        </text>
      </PieChart>
      <div>
        <div className={styles.directionWrapper}>
          <span style={{ fontSize: 13 }}>
            {t("angle", { defaultValue: "Ângulo" })}:{" "}
            <span
              className={styles.directionArrow}
              style={{ transform: `rotate(${position.ang}deg)` }}
            >
              ➤
            </span>{" "}
            {position.ang.toFixed(1)}°
          </span>
        </div>
        <div className={styles.addressText}>
          {currentPoint.address || "Endereço desconhecido"}
        </div>
      </div>
    </div>
  );
};

export default HUD;