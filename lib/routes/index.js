'use strict';
var express = require('express'),
    config = require('../../config'),
    docs = require('./doc'),
    apis = require('./api');

// inicializa as rotas
module.exports = function() {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // exibe o doc apenas se o ambiente nao eh producao
  if (config.env !== 'production') {
    router.use('/doc', docs());
  }

  // inclui as api
  router.use('/api', apis());

  // retorno das rotas configuradas
  return router;
};
