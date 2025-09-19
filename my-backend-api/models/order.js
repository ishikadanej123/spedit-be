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
      finalTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      shippingCharge: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      couponDiscount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: DataTypes.ENUM("processing", "completed", "failed"),
        allowNull: false,
        defaultValue: "processing",
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
