'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderCode: {
        type: Sequelize.INTEGER(11),
      },
      customerID: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'db_customers',
        },
      },
      orderDate: {
        type: Sequelize.DATE,
      },
      fullName: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.INTEGER,
      },
      money: {
        type: Sequelize.INTEGER(11),
      },
      price_ship: {
        type: Sequelize.INTEGER(11),
      },
      coupon: {
        type: Sequelize.INTEGER(11),
      },
      province: {
        type: Sequelize.INTEGER,
        references: {
          model: 'db_province',
        },
      },
      district: {
        type: Sequelize.INTEGER,
        references: {
          model: 'db_district',
        },
      },
      address: {
        type: Sequelize.STRING(11),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      trash: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_order');
  },
};
