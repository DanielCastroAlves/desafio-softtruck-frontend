import React, { useState, useEffect } from "react";
import type { ModalStopProps } from "../../../types/modal"; 

function formatElapsed(s: number) {
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const ModalStop: React.FC<ModalStopProps> = ({
  open,
  onSkip,
  tempoParado,
  tempoTotalParada,
  onFastForward
}) => {
  const [sliderValue, setSliderValue] = useState(tempoParado);

  // Sempre sincroniza slider com tempoParado real vindo do contexto
  useEffect(() => {
    setSliderValue(tempoParado);
  }, [tempoParado]);

  // Ao avançar slider até o fim, chama onSkip automaticamente
  useEffect(() => {
    if (sliderValue >= tempoTotalParada && tempoTotalParada > 0) {
      onSkip();
    }
    // eslint-disable-next-line
  }, [sliderValue, tempoTotalParada]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #0003",
        padding: 32,
        minWidth: 300,
        textAlign: "center",
      }}>
        <h2 style={{ color: "#d32f2f" }}>Parada Prolongada</h2>
        <p>O veículo está parado nesta simulação.</p>
        <p>
          <b>Tempo parado:</b>{" "}
          <span style={{ color: "#1976d2", fontWeight: 700 }}>
            {formatElapsed(sliderValue)}
          </span>
          {" / "}
          <span style={{ color: "#888", fontWeight: 500 }}>
            {formatElapsed(tempoTotalParada)}
          </span>
        </p>

        {/* Slider para simular avanço do tempo */}
        <div style={{ margin: "14px 0 22px 0" }}>
          <input
            type="range"
            min={0}
            max={tempoTotalParada}
            value={sliderValue}
            step={1}
            onChange={e => {
              const val = Number(e.target.value);
              setSliderValue(val);
              onFastForward(val); // Atualiza o contexto!
              if (val >= tempoTotalParada && tempoTotalParada > 0) {
                onSkip();
              }
            }}
            style={{ width: 220 }}
          />
        </div>

        <div style={{ margin: "8px 0 8px 0" }}>
          <button
            style={{
              padding: "8px 22px",
              borderRadius: 8,
              background: "#4caf50",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              marginRight: 10,
              cursor: "not-allowed",
              opacity: 0.7,
            }}
            disabled
          >
            Aguardando movimento...
          </button>
          <button
            style={{
              padding: "8px 22px",
              borderRadius: 8,
              background: "#ffc107",
              color: "#333",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onSkip}
          >
            Avançar parada
          </button>
        </div>
        <small style={{ color: "#888" }}>
          Você pode aguardar, avançar manualmente ou pular a parada.
        </small>
      </div>
    </div>
  );
};

export default ModalStop;
