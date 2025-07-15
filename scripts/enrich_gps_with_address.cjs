// scripts/enrich_gps_with_address.cjs

require('dotenv').config(); // <-- Carrega as variáveis do .env

const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Caminho dos arquivos de entrada e saída
const inputFile = './src/data/frontend_data_gps.json';
const outputFile = './src/data/frontend_data_gps_enriched_with_address.json';

// Token Mapbox - pegue do .env (VITE_MAPBOX_TOKEN)
const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN || ""; // ajuste conforme seu .env

if (!MAPBOX_TOKEN) {
  console.error("❌ Token do Mapbox não encontrado! Configure VITE_MAPBOX_TOKEN no .env.");
  process.exit(1);
}

// Função que faz reverse geocoding para obter endereço
async function getAddress(lat, lng) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=pt&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  if (data?.features?.[0]?.place_name) {
    return data.features[0].place_name;
  }
  return '';
}

// Função principal
(async () => {
  const content = fs.readFileSync(inputFile, 'utf-8');
  const json = JSON.parse(content);

  for (const [ci, course] of json.courses.entries()) {
    for (const [pi, point] of course.gps.entries()) {
      if (!point.address) { // Só busca se ainda não tem endereço
        try {
          console.log(`(${ci+1}/${json.courses.length}) Ponto ${pi+1}/${course.gps.length}: ${point.latitude},${point.longitude}`);
          point.address = await getAddress(point.latitude, point.longitude);
        } catch (e) {
          console.error('Erro:', e);
          point.address = '';
        }
        await new Promise((r) => setTimeout(r, 250)); // delay pra não bloquear
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), 'utf-8');
  console.log('✅ Arquivo enriquecido salvo em:', outputFile);
})();
