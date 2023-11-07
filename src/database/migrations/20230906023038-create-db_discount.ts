'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_discount', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      discount: {
        type: Sequelize.STRING,
      },
      limit_number: {
        type: Sequelize.INTEGER(11),
      },
      number_used: {
        type: Sequelize.INTEGER(11),
      },
      expiration_date: {
        type: Sequelize.DATE,
      },
      payment_limit: {
        type: Sequelize.INTEGER,
      },
      desc: {
        type: Sequelize.STRING,
      },
      order: {
        type: Sequelize.INTEGER(11),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_discount');
  },
};
