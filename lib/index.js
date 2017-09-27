'use strict';
var Promise = require('bluebird'),
    logger = require('./helpers/logger'),
    settings = require('../config'),
    Server = require('./helpers/Server'),
    Database = require('./helpers/Database');

// banner da api
logger.showBanner();

// objetos principais
var _db = null;
var _server = null;

// inicializa o servidor
Promise.resolve()
  // cria uma nova instancia da classe de banco
  .then(function() { return (_db = new Database(settings)); })

  // cria uma nova instancia da classe do servidor
  .then(function() { return (_server = new Server(settings)); })

  // conecta com o banco de dados
  .then(function() { return _db.connect(); })

  // inicializa as portas do servidor
  .then(function() { return _server.listen(); })

  // tratamento de erro geral
  .catch(function(error) {
    logger.error(error);
    process.exit(-1);
  });
