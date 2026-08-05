module.exports = (sequelize, DataTypes) => {
  const Commercant = sequelize.define(
    'Commercant',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'commercants',
      underscored: true,
      timestamps: false,
    }
  );

  return Commercant;
};
