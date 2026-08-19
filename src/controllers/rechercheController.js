const { Op } = require('sequelize');
const { Commerce, Produit, Categorie } = require('../models');
const { geocoderZone } = require('../services/geocodingService');
const { distanceHaversine } = require('../utils/distance');

const RAYON_DEFAUT_KM = 15;

async function rechercher(req, res) {
  try {
    const { motCle, zone, categorie_id } = req.query;
    const rayon = req.query.rayon ? parseFloat(req.query.rayon) : RAYON_DEFAUT_KM;

    let refLat = req.query.lat ? parseFloat(req.query.lat) : null;
    let refLng = req.query.lng ? parseFloat(req.query.lng) : null;

    if ((refLat === null || refLng === null) && zone) {
      const coords = await geocoderZone(zone);
      if (coords) {
        refLat = coords.latitude;
        refLng = coords.longitude;
      }
    }

    const aUnPointDeReference = refLat !== null && refLng !== null && !isNaN(refLat) && !isNaN(refLng);

    const filtreProduit = { disponibilite: true };
    if (motCle) {
      filtreProduit[Op.or] = [
        { nom: { [Op.iLike]: `%${motCle}%` } },
        { description: { [Op.iLike]: `%${motCle}%` } },
      ];
    }
    if (categorie_id) {
      filtreProduit.categorie_id = categorie_id;
    }

    const commerces = await Commerce.findAll({
      where: { active: true },
      include: [
        {
          model: Produit,
          where: filtreProduit,
          required: true,
          include: [{ model: Categorie, attributes: ['id', 'nom'] }],
        },
      ],
    });

    let resultats = commerces.map((commerce) => {
      const c = commerce.toJSON();
      if (aUnPointDeReference && c.latitude && c.longitude) {
        c.distance_km = Math.round(
          distanceHaversine(refLat, refLng, parseFloat(c.latitude), parseFloat(c.longitude)) * 10
        ) / 10;
      } else {
        c.distance_km = null;
      }
      return c;
    });

    if (aUnPointDeReference) {
      resultats = resultats.filter((c) => c.distance_km !== null && c.distance_km <= rayon);
      resultats.sort((a, b) => a.distance_km - b.distance_km);
    }

    return res.status(200).json({
      count: resultats.length,
      pointDeReference: aUnPointDeReference ? { latitude: refLat, longitude: refLng } : null,
      resultats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la recherche.' });
  }
}

module.exports = { rechercher };