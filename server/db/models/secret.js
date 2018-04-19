const Sequelize = require('sequelize');
const db = require('../db');

const Secret = db.define('secret', {
  message: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  isPublic: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = Secret;
