const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Availability = sequelize.define('Availability', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  day: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.STRING, allowNull: false },
  end: { type: DataTypes.STRING, allowNull: false },
  best: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Availability.sync();

module.exports = Availability; 