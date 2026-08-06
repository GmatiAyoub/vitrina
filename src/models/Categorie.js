module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define(
    'Categorie',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255) },
    },
    { tableName: 'categories', underscored: true, timestamps: false }
  );
  return Categorie;
};