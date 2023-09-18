'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_orderDetail', {
      orderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'db_order',
        },
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'db_products',
        },
      },
      count: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleteAt: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_orderDetail');
  },
};
