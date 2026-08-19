const express = require('express');
const { rechercher } = require('../controllers/rechercheController');

const router = express.Router();

router.get('/', rechercher);

module.exports = router;