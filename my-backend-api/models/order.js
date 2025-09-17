"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Order.belongsTo(models.Coupon, {
        foreignKey: "couponId",
        onDelete: "SET NULL",
      });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      couponId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Coupons",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userDetails: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      productDetails: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );

  return Order;
};
