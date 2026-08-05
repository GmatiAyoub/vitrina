const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { handleValidation } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
    body('role')
      .isIn(['client', 'commercant'])
      .withMessage("Le rôle doit être 'client' ou 'commercant'."),
  ],
  handleValidation,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('password').notEmpty().withMessage('Le mot de passe est requis.'),
  ],
  handleValidation,
  login
);

router.get('/me', authenticate, me);

module.exports = router;
