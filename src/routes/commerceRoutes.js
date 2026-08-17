const express = require('express');
const { body } = require('express-validator');
const {
  creerCommerce,
  getMonCommerce,
  updateMonCommerce,
} = require('../controllers/commerceController');
const { handleValidation } = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const trimBody = require('../middlewares/trimBody');

const router = express.Router();

const reglesCommerce = [
  body('nom').notEmpty().withMessage('Le nom du commerce est obligatoire.'),
  body('adresse').notEmpty().withMessage("L'adresse est obligatoire."),
  body('telephone').notEmpty().withMessage('Le téléphone est obligatoire.'),
  body('horaires').notEmpty().withMessage('Les horaires d’ouverture sont obligatoires.'),
];

router.post(
  '/',
  authenticate,
  authorize('commercant'),
  upload.single('photo'),
  trimBody, // req.body n'existe qu'après multer sur les routes form-data
  reglesCommerce,
  handleValidation,
  creerCommerce
);

router.get('/me', authenticate, authorize('commercant'), getMonCommerce);

router.put(
  '/me',
  authenticate,
  authorize('commercant'),
  upload.single('photo'),
  trimBody,
  updateMonCommerce
);

module.exports = router;