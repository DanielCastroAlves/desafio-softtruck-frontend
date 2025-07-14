
# 🧠 Planejamento de Desenvolvimento — Desafio Front-End Softruck

Documento com o planejamento das etapas de desenvolvimento do desafio técnico da Softruck, com foco em organização, clareza de escopo e justificativa das decisões técnicas adotadas.

---

## ⚙️ Stack Tecnológica

| Tecnologia     | Justificativa |
|----------------|---------------|
| **React** + **Vite** | Framework moderno e amplamente usado. Vite traz velocidade e boa experiência de desenvolvimento. |
| **TypeScript** | Tipagem estática para evitar erros e manter o código mais seguro e legível. |
| **Mapbox GL (via react-map-gl)** | Ferramenta robusta e performática para renderização de mapas com suporte a WebGL. |
| **@turf/**     | Biblioteca geoespacial usada para cálculos como direção, distância e interpolação sobre rotas. |
| **react-i18next** | Solução madura e flexível para internacionalização. |
| **SCSS**       | Permite organizar os estilos com mais clareza, usando variáveis, aninhamento e reaproveitamento. |
| **MUI (Material UI)** | Utilizado para agilizar o desenvolvimento da interface com componentes prontos, responsivos e acessíveis. Permite focar mais nas funcionalidades específicas do desafio. |

---

## 🧱 Por que MUI

A escolha do MUI foi estratégica:

- Reduz tempo gasto com estilização manual de botões, inputs e layout.
- Oferece responsividade e visual consistente, alinhado ao que a vaga espera.
- Ajuda a manter o foco no que mais importa neste desafio: a simulação baseada em GPS.

---

## 🗂️ Estrutura de Pastas Planejada

```
src/
├── assets/              # Sprite sheet e imagens
├── components/          # Componentes reutilizáveis (Car, MapView, HUD, etc.)
├── contexts/            # Estado global da simulação
├── data/                # Arquivos JSON com os trajetos
├── i18n/                # Configurações e arquivos de tradução
├── styles/              # Estilos organizados por componente (em SCSS)
├── App.tsx              # Componente raiz
└── main.tsx             # Ponto de entrada
```

---

## 🔁 Versionamento

O projeto será versionado usando convenções semânticas nos commits:

- `feat:` para novas funcionalidades
- `fix:` para correções
- `docs:` para documentação
- `style:` para mudanças de estilo e SCSS
- `chore:` para configuração do projeto

---

## 📱 Responsividade e Mobile-First

A interface será pensada com foco mobile-first, garantindo boa experiência em telas menores. O uso do MUI facilita essa abordagem por já trazer suporte a breakpoints e responsividade nativa nos componentes.

---

## 🧩 Etapas do Desenvolvimento

1. **Setup inicial**
   - Criar o projeto com Vite, React e TypeScript.
   - Instalar as bibliotecas principais (Mapbox, Turf, MUI, i18n, SCSS).

2. **Documentação**
   - Criar os arquivos `REQUISITOS.md` e `PLANEJAMENTO.md`.

3. **Renderização do mapa**
   - Exibir o mapa com base nos dados de rota do JSON.
   - Gerar a rota usando LineString com Turf.

4. **Animação do veículo**
   - Criar o componente do carro com base em uma sprite sheet.
   - Sincronizar com direção (ângulo) usando os dados GPS.

5. **Controles e HUD**
   - Play/Pause, reset e ajuste de velocidade.
   - Exibir informações em tempo real: velocidade, direção e horário.

6. **Troca de rota (tarefa bônus)**
   - Permitir selecionar qual rota será exibida no momento.

7. **Internacionalização**
   - Implementar troca entre português e inglês com react-i18next.

8. **Estilização com SCSS**
   - Refatorar estilos para SCSS com separação por componente.

9. **Refino final**
   - Ajustes visuais, testes, melhoria na animação e responsividade geral.

---

## 📌 Observações

Este planejamento serve como guia de desenvolvimento. Durante a execução, melhorias ou ajustes pontuais podem ser feitos com base em testes, desempenho ou clareza de código.
