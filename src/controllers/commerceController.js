const { Commerce } = require('../models');
const { geocoderAdresse } = require('../services/geocodingService');

async function creerCommerce(req, res) {
  try {
    const existant = await Commerce.findOne({ where: { utilisateur_id: req.user.id } });
    if (existant) {
      return res.status(409).json({ message: 'Vous avez déjà un commerce enregistré.' });
    }

    const { nom, adresse, telephone, horaires } = req.body;

    const coords = await geocoderAdresse(adresse);
    if (!coords) {
      return res.status(400).json({ message: 'Adresse invalide. Veuillez vérifier votre saisie.' });
    }

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const commerce = await Commerce.create({
      nom, adresse, telephone, horaires, photo,
      latitude: coords.latitude,
      longitude: coords.longitude,
      utilisateur_id: req.user.id,
    });

    return res.status(201).json({ message: 'Commerce créé avec succès.', commerce });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ce nom de commerce est déjà utilisé.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la création du commerce.' });
  }
}

async function getMonCommerce(req, res) {
  try {
    const commerce = await Commerce.findOne({ where: { utilisateur_id: req.user.id } });
    if (!commerce) return res.status(404).json({ message: 'Aucun commerce trouvé pour ce compte.' });
    return res.status(200).json({ commerce });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération du commerce.' });
  }
}

async function updateMonCommerce(req, res) {
  try {
    const commerce = await Commerce.findOne({ where: { utilisateur_id: req.user.id } });
    if (!commerce) return res.status(404).json({ message: 'Aucun commerce trouvé pour ce compte.' });

    const { nom, adresse, telephone, horaires } = req.body;

    if (adresse && adresse !== commerce.adresse) {
      const coords = await geocoderAdresse(adresse);
      if (!coords) return res.status(400).json({ message: 'Adresse invalide. Veuillez vérifier votre saisie.' });
      commerce.latitude = coords.latitude;
      commerce.longitude = coords.longitude;
      commerce.adresse = adresse;
    }

    if (nom) commerce.nom = nom;
    if (telephone) commerce.telephone = telephone;
    if (horaires) commerce.horaires = horaires;
    if (req.file) commerce.photo = `/uploads/${req.file.filename}`;

    await commerce.save();
    return res.status(200).json({ message: 'Commerce mis à jour.', commerce });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du commerce.' });
  }
}

module.exports = { creerCommerce, getMonCommerce, updateMonCommerce };