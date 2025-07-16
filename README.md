# desafio-softtruck-frontend

Simulador de rastreamento veicular com animação em sprite sobre mapa, desenvolvido como parte do desafio técnico da Softruck.

## 🚀 Tecnologias utilizadas

* **React + Vite** – Estrutura leve e moderna para aplicações front-end.
* **TypeScript** – Garantia de tipagem estática e melhor manutenção.
* **Mapbox GL JS** – Visualização interativa de mapas.
* **@turf/turf** – Geoprocessamento para cálculo de distância e direção.
* **react-i18next** – Suporte multilíngue com alternância entre idiomas.
* **SCSS Modules** – Estilização modular e organizada por componente.

## 🧩 Estrutura do projeto

* `src/features/MapView` – Tela principal com o mapa e lógica de simulação.
* `src/features/components/` – Componentes reutilizáveis: HUD, painel, carro, seletores etc.
* `src/contexts/` – Contexto global para estado da simulação.
* `src/hooks/` – Hooks personalizados (ex: dados GPS, reverse geocode).
* `src/data/` – Arquivos de dados simulados de trajetos.
* `src/i18n/` – Configurações e traduções PT/EN.

## 💡 Funcionalidades implementadas

* ✅ Animação fluida de um carro com sprite, orientado pela direção do trajeto.
* ✅ Velocidade real baseada nos dados de GPS (`auto`) ou definida manualmente.
* ✅ Alternância entre diferentes trajetos disponíveis.
* ✅ Painel de controle com modo de velocidade, reset e troca de rota.
* ✅ Internacionalização completa entre Português e Inglês.

## ▶️ Executar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) em seu navegador.

---

