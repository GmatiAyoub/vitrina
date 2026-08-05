module.exports = (sequelize, DataTypes) => {
  const Administrateur = sequelize.define(
    'Administrateur',
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
      tableName: 'administrateurs',
      underscored: true,
      timestamps: false,
    }
  );

  return Administrateur;
};
