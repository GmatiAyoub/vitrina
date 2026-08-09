const express = require('express');
const { body } = require('express-validator');
const { creerProduit, getMesProduits, updateProduit, supprimerProduit } = require('../controllers/produitController');
const { handleValidation } = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

const reglesProduit = [
  body('nom').notEmpty().withMessage('Le nom du produit est obligatoire.'),
  body('prix').notEmpty().withMessage('Le prix est obligatoire.'),
];

router.post('/', authenticate, authorize('commercant'), upload.array('photos', 6), reglesProduit, handleValidation, creerProduit);
router.get('/mes-produits', authenticate, authorize('commercant'), getMesProduits);
router.put('/:id', authenticate, authorize('commercant'), upload.array('photos', 6), updateProduit);
router.delete('/:id', authenticate, authorize('commercant'), supprimerProduit);

module.exports = router;