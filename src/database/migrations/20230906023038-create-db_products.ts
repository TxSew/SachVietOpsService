'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'db_category',
        },
      },
      title: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      listImage: {
        type: Sequelize.STRING,
      },
      sortDesc: {
        type: Sequelize.TEXT,
      },
      producerID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'db_producer',
        }
      },
      number: {
        type: Sequelize.INTEGER(11),
      },
      sale: {
        type: Sequelize.INTEGER(11),
      },
      price_sale: {
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
      trash: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_products');
  },
};
