"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Cart, { foreignKey: "userId" });
      User.hasMany(models.Wishlist, { foreignKey: "userId" });
      User.hasMany(models.RecentView, { foreignKey: "userId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
      User.hasMany(models.AuthProvider, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9+\-() ]+$/i,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      addresses: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
          isValidAddresses(value) {
            if (value && typeof value !== "object") {
              throw new Error("Addresses must be a valid JSON object");
            }
          },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
