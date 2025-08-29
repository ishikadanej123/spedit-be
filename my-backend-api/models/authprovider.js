"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuthProvider extends Model {
    static associate(models) {
      AuthProvider.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  AuthProvider.init(
    {
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AuthProvider",
      tableName: "AuthProviders",
      timestamps: true,
    }
  );

  return AuthProvider;
};
