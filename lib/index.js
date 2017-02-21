'use strict';
var Promise = require('bluebird'),
    logger = require('./helpers/logger'),
    config = require('../config'),
    Server = require('./helpers/Server'),
    Database = require('./helpers/Database');

// banner da api
logger.showBanner();

// novas instancias dos objetos principais
var _db = new Database(config);
var _server = new Server(config);

// inicializa o servidor
Promise.resolve()

  // conecta com o banco de dados
  .then(function() { return _db.connect(); })

  // inicializa as portas do servidor
  .then(function() { return _server.listen(); })

  // tratamento de erro geral
  .catch(function(error) {
    logger.error(error);
    process.exit(-1);
  });
