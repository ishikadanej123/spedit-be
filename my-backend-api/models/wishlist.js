"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.User, {
        foreignKey: "userId",
        field: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Wishlist.init(
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        field: "userId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      productId: DataTypes.STRING,
      productName: DataTypes.STRING,
      productImage: DataTypes.STRING,
      size: DataTypes.STRING,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "Wishlists",
    }
  );
  return Wishlist;
};
