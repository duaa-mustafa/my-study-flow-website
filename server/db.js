const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('studyflow', 'root', 'Duaa.mustafa1', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // optional: disable SQL logs
});

module.exports = sequelize;
