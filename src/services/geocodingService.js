const axios = require('axios');

async function geocoderAdresse(adresse) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: `${adresse}, Mornag, Tunisie`, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'VitrinaApp/1.0 (contact: contact@vitrina.tn)' },
      timeout: 5000,
    });
    if (!response.data || response.data.length === 0) return null;
    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (err) {
    console.error('Erreur de géocodage :', err.message);
    return null;
  }
}

module.exports = { geocoderAdresse };