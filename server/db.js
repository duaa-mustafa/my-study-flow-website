   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize('studyflow', 'root', 'Duaa.mustafa1', {
     host: 'localhost',
     dialect: 'mysql',
   });

   // SQL to create the database for the library scenario
   const createLibraryDB = `CREATE DATABASE IF NOT EXISTS library_system;`;

   module.exports = sequelize;