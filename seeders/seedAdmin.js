require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Utilisateur, Administrateur } = require('../src/models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // s'assure que les tables existent

    const email = process.env.ADMIN_EMAIL || 'admin@vitrina.tn';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

    const existant = await Utilisateur.findOne({ where: { email } });
    if (existant) {
      console.log(`ℹ️  L'administrateur ${email} existe déjà. Rien à faire.`);
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const utilisateur = await Utilisateur.create({
      email,
      password_hash,
      role: 'admin',
      active: true,
    });

    await Administrateur.create({ utilisateur_id: utilisateur.id });

    console.log('✅ Administrateur créé avec succès :');
    console.log(`   Email    : ${email}`);
    console.log(`   Mot de passe : ${password}`);
    console.log('   ⚠️  Pensez à changer ce mot de passe en production.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed admin :', err);
    process.exit(1);
  }
}

seedAdmin();
