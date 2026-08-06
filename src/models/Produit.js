module.exports = (sequelize, DataTypes) => {
  const Produit = sequelize.define(
    'Produit',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nom: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: { args: [0.01], msg: 'Le prix doit être supérieur à 0 DT.' } },
      },
      tailles: { type: DataTypes.STRING(50) },
      disponibilite: { type: DataTypes.BOOLEAN, defaultValue: true },
      photos: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      signalement: { type: DataTypes.BOOLEAN, defaultValue: false },
      non_conforme: { type: DataTypes.BOOLEAN, defaultValue: false },
      commerce_id: { type: DataTypes.INTEGER, allowNull: false },
      categorie_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'produits',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Produit;
};