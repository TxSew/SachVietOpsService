'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_config', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mail_smtp: {
        type: Sequelize.STRING(100),
      },
      mail_smtp_password: {
        type: Sequelize.STRING(100),
      },
      mail_noreply: {
        type: Sequelize.STRING(100),
      },
      title: {
        type: Sequelize.STRING(30),
      },
      desc: {
        type: Sequelize.STRING(30),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_config');
  },
};
