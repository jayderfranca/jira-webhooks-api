'use strict';
var express = require('express'),
    path = require('path'),
    docs = require('./doc'),
    apis = require('./api');

// inicializa as rotas
module.exports = function(app, settings) {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // exibe o doc apenas se o ambiente nao eh producao
  if (settings.env !== 'production') {
    router.use('/doc', docs(app, settings));
    app.use('/orig', express.static(path.join(__dirname, '../../node_modules/swagger-ui-dist')));
  }

  // inclui as api
  router.use('/api', apis(app, settings));

  // indicador que node esta ativo
  /**
   * @swagger
   */
  router.get('/health', function(req, res, next) {
    res.status(200).send({'status': 'OK'});
  });

  // retorno das rotas configuradas
  return router;
};
