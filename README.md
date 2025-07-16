# desafio-softtruck-frontend

Simulador de rastreamento veicular com animação em sprite sobre mapa, desenvolvido como parte do desafio técnico da Softruck.

## 🚀 Tecnologias utilizadas

- **React + Vite**: estrutura leve e moderna.
- **TypeScript**: segurança de tipos.
- **Mapbox GL JS**: renderização do mapa.
- **@turf/turf**: geoprocessamento (direção e distância).
- **react-i18next**: internacionalização.
- **SCSS Modules**: organização modular de estilos.

## 🧩 Estrutura do projeto

- `src/features/MapView`: tela principal com o mapa.
- `src/components/`: componentes reutilizáveis (HUD, painel, seletores).
- `src/hooks/`: lógica de animação e dados GPS.
- `src/data/`: arquivos com dados simulados do trajeto.

## 💡 Funcionalidades

- Animação do carro por sprite baseado em direção.
- Velocidade real definida pelos dados GPS.
- Troca entre diferentes trajetos.
- Tradução entre idiomas (PT/EN).
- Painel de controle da simulação.

## ▶️ Executar localmente

```bash
npm install
npm run dev
