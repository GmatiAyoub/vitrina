const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const trimBody = require('./middlewares/trimBody');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trimBody); // nettoie req.body pour les requêtes JSON (ex: /auth)

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'vitrina-backend' });
});
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));


app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur.',
  });
});

module.exports = app;
