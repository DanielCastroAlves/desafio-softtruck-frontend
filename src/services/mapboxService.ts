const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,place,locality,neighborhood&language=pt`;
  const resp = await fetch(url);
  if (!resp.ok) return "";
  const data = await resp.json();
  // Pega o texto mais específico (rua, bairro, cidade)
  return data.features?.[0]?.place_name || "";
}
