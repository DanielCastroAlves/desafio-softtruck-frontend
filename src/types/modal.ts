export interface ModalStopProps {
  open: boolean;
  onSkip: () => void;
  tempoParado: number;
  tempoTotalParada: number;
  onFastForward: (novoTempo: number) => void;
}
