// src/features/components/HUD/HUD.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import { useGps } from "../../../contexts/GpsContext";
import gpsData from "../../../data/frontend_data_gps_enriched_with_address.json";
import { PieChart, Pie, Cell } from "recharts";

interface HUDProps {
  tempoParado: number;
  tempoRodando: number;
}

function formatElapsed(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const MAX_SPEED = 200;
const chartData = [
  { name: "Baixa", value: MAX_SPEED * 0.4, color: "#4caf50" },
  { name: "Média", value: MAX_SPEED * 0.4, color: "#ffc107" },
  { name: "Alta", value: MAX_SPEED * 0.2, color: "#f44336" },
];

const RADIAN = Math.PI / 180;

type NeedleProps = { value: number; data: any[]; cx: number; cy: number; iR: number; oR: number; color: string; };

const needle = ({ value, data, cx, cy, iR, oR, color }: NeedleProps) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 8;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;
  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path key="needle-path" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} fill={color} />,
  ];
};

const HUD: React.FC<HUDProps> = ({ tempoParado, tempoRodando }) => {
  const { t } = useTranslation();
  const { position, selectedCourse, isStopped } = useGps();

  const points = gpsData.courses[selectedCourse]?.gps ?? [];
  const closestIdx = points.length > 0
    ? points.reduce((acc, point, idx) => {
        const d =
          Math.abs(point.latitude - position.lat) +
          Math.abs(point.longitude - position.lng);
        return d < acc.dist ? { dist: d, idx } : acc;
      }, { dist: Infinity, idx: 0 }).idx
    : 0;

  const currentPoint = points[closestIdx] || {};
  const speedValue = Math.max(0, Math.min(position.vel, MAX_SPEED));
  const cx = 100, cy = 110, iR = 58, oR = 95;

  // Status text fallback
  const statusText = isStopped
    ? t("stopped", { defaultValue: "PARADO" })
    : t("moving", { defaultValue: "EM MOVIMENTO" });

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        background: "rgba(0,0,0,0.76)",
        borderRadius: 16,
        padding: 12,
        color: "#fff",
        zIndex: 15,
        boxShadow: "0 3px 18px #0004",
        width: 230,
        minHeight: 210,
        textAlign: "center"
      }}
    >
      {/* Status do veículo */}
      <div style={{ marginBottom: 8, marginTop: 2 }}>
        <span
          style={{
            display: "inline-block",
            padding: "3px 12px",
            borderRadius: 999,
            background: isStopped ? "#d32f2f" : "#388e3c",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 1px 4px #0007",
            letterSpacing: 0.5,
            minWidth: 80,
            transition: "background 0.3s",
          }}
        >
          {statusText}
        </span>
        <div style={{ marginTop: 6 }}>
          <span style={{ fontSize: 13, color: "#ffd600", fontWeight: 500 }}>
            Parado: {formatElapsed(tempoParado)}
          </span>
        </div>
        <div>
          <span style={{ fontSize: 13, color: "#aef59f", fontWeight: 500 }}>
            Rodando: {formatElapsed(tempoRodando)}
          </span>
        </div>
      </div>

      <PieChart width={200} height={130}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={chartData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          stroke="none"
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        {needle({
          value: speedValue,
          data: chartData,
          cx,
          cy,
          iR,
          oR,
          color: "#f9e025",
        })}
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: "#fff",
            fontSize: "26px",
            fontWeight: "bold",
            textShadow: "0 1px 6px #000a",
          }}
        >
          {speedValue.toFixed(0)}
        </text>
        <text
          x={cx}
          y={cy + 38}
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
      <div style={{ marginTop: 0 }}>
        {/* Direção visual (seta) */}
        <div style={{ margin: "8px 0" }}>
          <span style={{ fontSize: 13 }}>
            {t("angle", { defaultValue: "Ângulo" })}:{" "}
            <span
              style={{
                display: "inline-block",
                transform: `rotate(${position.ang}deg)`,
                transition: "transform 0.2s"
              }}
            >
              ➤
            </span>
            {" "}
            {position.ang.toFixed(1)}°
          </span>
        </div>
        {/* Nome da rua/endereço */}
        <div style={{
          fontSize: 13,
          color: "#ddd",
          minHeight: 18,
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {currentPoint.address || "Endereço desconhecido"}
        </div>
      </div>
    </div>
  );
};

export default HUD;
