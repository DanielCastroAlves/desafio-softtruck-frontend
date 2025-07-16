import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import type { ModalStopProps } from "../../../types/modal";
import styles from "./ModalStop.module.scss";

function formatElapsed(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
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

  useEffect(() => {
    setSliderValue(tempoParado);
  }, [tempoParado]);

  useEffect(() => {
    if (sliderValue >= tempoTotalParada && tempoTotalParada > 0) {
      onSkip();
    }
  }, [sliderValue, tempoTotalParada, onSkip]);

  return (
    <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
      <Box className={styles.modalContent}>
        <Typography variant="h5" className={styles.title} color="error" gutterBottom>
          Parada Prolongada
        </Typography>
        <Typography variant="body1" className={styles.text}>
          O veículo está parado nesta simulação.
        </Typography>
        <Typography variant="body2" className={styles.text}>
          <b>Tempo parado: </b>
          <span className={styles.elapsed}>{formatElapsed(sliderValue)}</span>
          {" / "}
          <span className={styles.total}>{formatElapsed(tempoTotalParada)}</span>
        </Typography>

        <Slider
          min={0}
          max={tempoTotalParada}
          value={sliderValue}
          step={1}
          onChange={(_, val) => {
            const value = Number(val);
            setSliderValue(value);
            onFastForward(value);
            if (value >= tempoTotalParada && tempoTotalParada > 0) {
              onSkip();
            }
          }}
          className={styles.slider}
        />

        <div className={styles.buttonGroup}>
          <Button
            variant="contained"
            color="success"
            disabled
            className={styles.waitBtn}
          >
            Aguardando movimento...
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={onSkip}
            className={styles.skipBtn}
          >
            Avançar parada
          </Button>
        </div>
        <Typography variant="caption" className={styles.caption}>
          Você pode aguardar, avançar manualmente ou pular a parada.
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalStop;
