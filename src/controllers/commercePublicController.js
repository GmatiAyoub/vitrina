const { Commerce, Produit, Categorie } = require('../models');

async function getFicheCommerce(req, res) {
  try {
    const commerce = await Commerce.findOne({
      where: { id: req.params.id, active: true },
      include: [
        {
          model: Produit,
          where: { disponibilite: true },
          required: false,
          include: [{ model: Categorie, attributes: ['id', 'nom'] }],
        },
      ],
    });

    if (!commerce) {
      return res.status(404).json({ message: 'Commerce introuvable.' });
    }

    return res.status(200).json({ commerce });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération du commerce.' });
  }
}

module.exports = { getFicheCommerce };