module.exports = (sequelize, DataTypes) => {
  const Commerce = sequelize.define(
    'Commerce',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING(255), allowNull: false, unique: true }, // RM-01
      adresse: { type: DataTypes.STRING(255), allowNull: false },
      telephone: { type: DataTypes.STRING(20), allowNull: false },
      horaires: { type: DataTypes.STRING(255), allowNull: false }, // RM-03
      photo: { type: DataTypes.STRING(255) },
      latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      utilisateur_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    },
    {
      tableName: 'commerces',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Commerce;
};