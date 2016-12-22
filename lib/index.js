'use strict';
var logger = require('./helpers/logger'),
    config = require('../config'),
    Server = require('./helpers/Server'),
    Database = require('./helpers/Database'),
    Promise = require('bluebird');

// banner da api
logger.banner();

// novas instancias dos objetos principais
var db = new Database(config);
var server = new Server(config);

// inicializa o servidor
Promise.resolve()
  .then(function () { return db.connect() })
  .then(function () { return server.listen() })
  .catch(function (error) {
    logger.error(error);
    process.exit(-1);
  });
