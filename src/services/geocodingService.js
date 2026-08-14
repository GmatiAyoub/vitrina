const axios = require('axios');

async function tenterGeocodage(query) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'VitrinaApp/1.0 (contact: contact@vitrina.tn)' },
      timeout: 8000,
    });
    if (!response.data || response.data.length === 0) return null;
    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (err) {
    console.error(`Erreur géocodage pour "${query}" :`, err.message);
    return null;
  }
}

/**
 * Géocode une adresse. Essaie l'adresse précise d'abord, puis se replie
 * sur "Mornag, Tunisie" seul si l'adresse exacte n'est pas trouvée
 * (le MVP cible exclusivement Mornag, donc un repli sur la ville reste pertinent).
 */
async function geocoderAdresse(adresse) {
  const precis = await tenterGeocodage(`${adresse}, Mornag, Tunisie`);
  if (precis) return precis;

  console.warn(`Adresse précise non trouvée ("${adresse}"), repli sur Mornag, Tunisie.`);
  return tenterGeocodage('Mornag, Tunisie');
}

module.exports = { geocoderAdresse };