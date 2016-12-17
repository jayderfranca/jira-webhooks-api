'use strict';
var logger = require('./helpers/logger');
var config = require('../config');
var Server = require('./helpers/Server');

/** instancia um novo server */
var server = new Server(config);

/* inicializa o servidor */
server.listen()
  .then(function() {
    logger.info('OK');
  }, function(error) {
    logger.log('error', 'NOK\n', error);
  });
