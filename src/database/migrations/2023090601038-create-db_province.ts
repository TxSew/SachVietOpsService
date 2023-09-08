'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_province', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      type: {
        type: Sequelize.STRING(30),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_province');
  },
};
