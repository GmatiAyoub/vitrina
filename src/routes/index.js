const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

// Les routes des Sprints suivants seront branchées ici :
// router.use('/commerces', commerceRoutes);
// router.use('/produits', produitRoutes);
// router.use('/favoris', favoriRoutes);
// router.use('/admin', adminRoutes);

module.exports = router;
