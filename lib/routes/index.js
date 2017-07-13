'use strict';
var express = require('express');

// inicializa as rotas desta api
function init() {
  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // retorno das rotas configuradas
  return router;
}

module.exports = init;
