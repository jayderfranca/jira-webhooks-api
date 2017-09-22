'use strict';
var express = require('express'),
    swagger = require('swagger-jsdoc'),
    path = require('path'),
    fs = require('fs'),
    pkg = require('../../../package.json');

// inicializa as rotas
module.exports = function() {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // caminho do swagger-ui
  var swagger_ui = path.join(__dirname, '../../../node_modules/swagger-ui-dist');

  // monta o arquivo de definicao
  var options = {
    swaggerDefinition: {
      info: {
        title: pkg.name,
        version: pkg.version,
        description: pkg.description
      }
    },
    apis: [
      './lib/routes/api/*.js'
    ]
  };

  // cria o spec da api
  var spec = swagger(options);

  // rota do arquivo criado com as apis
  router.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });

  // hack para o arquivo index.html para informar o arquivo
  router.get('(/index.html)?', function(req, res) {

    // monta a url do arquivo do swagger
    var url = req.protocol + '://' +
              req.get('host') +
              req.originalUrl.replace('index.html', '') +
              'swagger.json';

    // substitui no arquivo a url correta
    var html = fs
      .readFileSync(path.join(swagger_ui, '/index.html'), 'binary')
      .replace('http://petstore.swagger.io/v2/swagger.json', url);

    // retorna o html alterado
    res.status(200).send(html);
  });

  // demais arquivos do swagger-ui
  router.use(express.static(swagger_ui));

  // retorno das rotas configuradas
  return router;
};
