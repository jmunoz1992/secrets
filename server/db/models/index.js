const User = require('./user');
const Secret = require('./secret');

Secret.belongsTo(User);

module.exports = {
  User,
  Secret
};
