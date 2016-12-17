'use strict';
var logger = require('./helpers/logger'),
    config = require('../config'),
    Server = require('./helpers/Server'),
    Database = require('./helpers/Database'),
    Promise = require('bluebird');

// banner da api
logger.log('info','*************************************************');
logger.log('info','              jira-webhooks-api                  ');
logger.log('info','*************************************************');

// obtem o nome do ambiente para formatacao
var captalized = config.env.charAt(0).toLocaleUpperCase() + config.env.slice(1);

// informacao do ambiente
logger.info('** Ambiente %s', captalized);

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
