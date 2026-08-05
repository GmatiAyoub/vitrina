const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modèles (correspondent au diagramme de classes UML)
db.Utilisateur = require('./Utilisateur')(sequelize, DataTypes);
db.Client = require('./Client')(sequelize, DataTypes);
db.Commercant = require('./Commercant')(sequelize, DataTypes);
db.Administrateur = require('./Administrateur')(sequelize, DataTypes);
db.LogAdmin = require('./LogAdmin')(sequelize, DataTypes);

// --- Associations (héritage par table, cf. diagramme de classes) ---
// Utilisateur 1 -- 1 Client / Commercant / Administrateur
db.Utilisateur.hasOne(db.Client, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
db.Client.belongsTo(db.Utilisateur, { foreignKey: 'utilisateur_id' });

db.Utilisateur.hasOne(db.Commercant, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
db.Commercant.belongsTo(db.Utilisateur, { foreignKey: 'utilisateur_id' });

db.Utilisateur.hasOne(db.Administrateur, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
db.Administrateur.belongsTo(db.Utilisateur, { foreignKey: 'utilisateur_id' });

// Utilisateur "génère" 0..* LogAdmin
db.Utilisateur.hasMany(db.LogAdmin, { foreignKey: 'utilisateur_id' });
db.LogAdmin.belongsTo(db.Utilisateur, { foreignKey: 'utilisateur_id' });

module.exports = db;
