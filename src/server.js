require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie.');

    // En développement uniquement : synchronise les modèles avec la DB.
    // En production, utiliser les migrations (npm run migrate).
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modèles synchronisés avec la base de données.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Serveur Vitrina démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Impossible de démarrer le serveur :', err);
    process.exit(1);
  }
}

start();
