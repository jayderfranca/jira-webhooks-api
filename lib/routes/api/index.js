'use strict';
var express = require('express'),
    worklogs = require('./worklogs');

// inicializa as rotas
module.exports = function() {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // rotas de worklogs
  router.use('/worklogs', worklogs());

  // retorno das rotas configuradas
  return router;
};
