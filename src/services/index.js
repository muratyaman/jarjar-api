/* eslint-disable-next-line no-unused-vars */
const clients = require('./clients/clients.service.js');
const users = require('./users/users.service.js');
module.exports = function (app) {
  app.configure(clients);
  app.configure(users);
};
