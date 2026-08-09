const express = require('express');
const authRoutes = require('./authRoutes');
const commerceRoutes = require('./commerceRoutes');
const produitRoutes = require('./produitRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/commerces', commerceRoutes);
router.use('/produits', produitRoutes);

module.exports = router;