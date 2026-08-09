const { Produit, Commerce } = require('../models');

async function getCommerceDuCommercant(utilisateurId) {
  return Commerce.findOne({ where: { utilisateur_id: utilisateurId } });
}

async function creerProduit(req, res) {
  try {
    const commerce = await getCommerceDuCommercant(req.user.id);
    if (!commerce) {
      return res.status(404).json({ message: "Créez d'abord votre profil commerce avant d'ajouter des produits." });
    }

    const fichiers = req.files || [];
    if (fichiers.length === 0) {
      return res.status(400).json({ message: 'Une photo est obligatoire pour publier un produit.' });
    }

    const { nom, description, prix, tailles, disponibilite, categorie_id } = req.body;

    const prixNombre = parseFloat(prix);
    if (!prix || isNaN(prixNombre) || prixNombre <= 0) {
      return res.status(400).json({ message: 'Le prix doit être renseigné et supérieur à 0 DT.' });
    }

    const photos = fichiers.map((f) => `/uploads/${f.filename}`);

    const produit = await Produit.create({
      nom, description, prix: prixNombre, tailles,
      disponibilite: disponibilite !== undefined ? disponibilite === 'true' || disponibilite === true : true,
      photos,
      commerce_id: commerce.id,
      categorie_id: categorie_id || null,
    });

    return res.status(201).json({ message: 'Produit ajouté avec succès.', produit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur lors de l'ajout du produit." });
  }
}

async function getMesProduits(req, res) {
  try {
    const commerce = await getCommerceDuCommercant(req.user.id);
    if (!commerce) return res.status(404).json({ message: 'Aucun commerce trouvé pour ce compte.' });
    const produits = await Produit.findAll({ where: { commerce_id: commerce.id }, order: [['created_at', 'DESC']] });
    return res.status(200).json({ produits });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
  }
}

async function updateProduit(req, res) {
  try {
    const produit = await Produit.findByPk(req.params.id, { include: Commerce });
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });
    if (produit.Commerce.utilisateur_id !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres produits.' });
    }

    const { nom, description, prix, tailles, disponibilite, categorie_id } = req.body;

    if (prix !== undefined) {
      const prixNombre = parseFloat(prix);
      if (isNaN(prixNombre) || prixNombre <= 0) {
        return res.status(400).json({ message: 'Le prix doit être supérieur à 0 DT.' });
      }
      produit.prix = prixNombre;
    }

    if (nom) produit.nom = nom;
    if (description !== undefined) produit.description = description;
    if (tailles !== undefined) produit.tailles = tailles;
    if (disponibilite !== undefined) produit.disponibilite = disponibilite === 'true' || disponibilite === true;
    if (categorie_id !== undefined) produit.categorie_id = categorie_id;

    if (req.files && req.files.length > 0) {
      produit.photos = req.files.map((f) => `/uploads/${f.filename}`);
    }

    await produit.save();
    return res.status(200).json({ message: 'Produit mis à jour.', produit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.' });
  }
}

async function supprimerProduit(req, res) {
  try {
    const produit = await Produit.findByPk(req.params.id, { include: Commerce });
    if (!produit) return res.status(404).json({ message: 'Produit introuvable.' });
    if (produit.Commerce.utilisateur_id !== req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres produits.' });
    }
    await produit.destroy();
    return res.status(200).json({ message: 'Produit supprimé.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la suppression du produit.' });
  }
}

module.exports = { creerProduit, getMesProduits, updateProduit, supprimerProduit };