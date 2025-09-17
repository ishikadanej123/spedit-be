"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      Coupon.hasMany(models.Order, { foreignKey: "couponId" });
    }
  }

  Coupon.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      discountPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      maxDiscountAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "Coupons",
      timestamps: true,
    }
  );

  return Coupon;
};
