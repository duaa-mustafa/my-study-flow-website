const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  done: { type: DataTypes.BOOLEAN, defaultValue: false },
  dueDate: { type: DataTypes.STRING },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
  order: { type: DataTypes.INTEGER },
});

Task.sync();

module.exports = Task; 