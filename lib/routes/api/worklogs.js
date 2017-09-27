'use strict';
var express = require('express');

// inicializa as rotas
module.exports = function(app, settings) {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  /**
   * @swagger
   * tags:
   *   name: worklogs
   *   description: Gerenciamento de Worklogs do JIRA.
   */

  /**
   * @swagger
   * /api/worklogs:
   *  get:
   *    security:
   *      - JWT
   *    tags:
   *      - worklogs
   *    description: Retorna todos WorkLogs cadastrados.
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Sucesso ao listar o recurso.
   */
  router.get('/', function(req, res, next) {
    res.sendStatus(200);
  });

  // retorno das rotas configuradas
  return router;
};
