"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "finalTotal", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("Orders", "shippingCharge", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("Orders", "couponDiscount", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "finalTotal");
    await queryInterface.removeColumn("Orders", "shippingCharge");
    await queryInterface.removeColumn("Orders", "couponDiscount");
  },
};
