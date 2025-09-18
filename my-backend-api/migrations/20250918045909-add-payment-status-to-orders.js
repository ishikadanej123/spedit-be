"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "paymentStatus", {
      type: Sequelize.ENUM("processing", "completed", "failed"),
      allowNull: false,
      defaultValue: "processing",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "paymentStatus");
  },
};
